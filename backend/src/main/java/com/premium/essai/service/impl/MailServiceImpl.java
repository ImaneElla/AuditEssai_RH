package com.premium.essai.service.impl;

import com.premium.essai.model.HistoriqueEmail;
import com.premium.essai.model.ParametresCompte;
import com.premium.essai.model.PeriodeEvaluation;
import com.premium.essai.model.TemplateEmail;
import com.premium.essai.model.User;
import com.premium.essai.model.enums.RoleDestinataire;
import com.premium.essai.model.enums.StatutEmail;
import com.premium.essai.model.enums.TypeEmail;
import com.premium.essai.repository.HistoriqueEmailRepository;
import com.premium.essai.repository.ParametresCompteRepository;
import com.premium.essai.repository.TemplateEmailRepository;
import com.premium.essai.repository.UserRepository;
import com.premium.essai.service.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;
    private final TemplateEmailRepository templateEmailRepository;
    private final HistoriqueEmailRepository historiqueEmailRepository;
    private final ParametresCompteRepository parametresCompteRepository;
    private final UserRepository userRepository;

    private static final String APP_URL = "localhost:8080/evaluation/";

    @Override
    @Transactional
    public void sendRappelJ21(PeriodeEvaluation periode) {
        sendEmailAvecTemplate(periode, TypeEmail.EMAIL_1_PREMIER_RAPPEL);
    }

    @Override
    @Transactional
    public void sendRappelJ14(PeriodeEvaluation periode) {
        sendEmailAvecTemplate(periode, TypeEmail.EMAIL_2_SECOND_RAPPEL);
    }

    @Override
    @Transactional
    public void sendRappelJ7(PeriodeEvaluation periode) {
        sendEmailAvecTemplate(periode, TypeEmail.EMAIL_3_DERNIER_RAPPEL);
    }

    @Override
    @Transactional
    public void sendAlerteRetard(PeriodeEvaluation periode, int joursRetard) {
        String destinataire = periode.getResponsable().getEmail();
        String nomSalarie = periode.getSalarie().getFirstName() + " " + periode.getSalarie().getLastName();

        String objet = "URGENT : [Ã‰CHÃ‰ANCE DÃ‰PASSÃ‰E +" + joursRetard + "j] Ã‰valuation PÃ©riode d'Essai - " + nomSalarie;
        String corps = String.format(
                "Bonjour %s,\n\n" +
                "Le dÃ©lai d'Ã©valuation pour %s est dÃ©passÃ© de %d jour(s) (Ã‰chÃ©ance du %s).\n\n" +
                "Ce dossier est sous le contrÃ´le de la Direction RH. Pour soumettre une Ã©valuation tardive, veuillez contacter le pÃ´le RH.\n\n" +
                "Direction RH - Groupe Premium",
                periode.getResponsable().getLastName(), nomSalarie, joursRetard, periode.getDateEcheance()
        );

        boolean succes = dispatchEmail(destinataire, objet, corps);
        logHistorique(periode, destinataire, periode.getResponsable().getLastName(), RoleDestinataire.RESPONSABLE, objet, TypeEmail.EMAIL_3_EN_RETARD, corps, null, succes);
    }

    @Override
    @Transactional
    public void sendNotificationFormulaireRempliAuxAdmins(PeriodeEvaluation periode) {
        String nomSalarie = periode.getSalarie().getFirstName() + " " + periode.getSalarie().getLastName();
        String nomManager = periode.getResponsable().getFirstName() + " " + periode.getResponsable().getLastName();

        List<User> admins = userRepository.findAll();

        String objet = "Formulaire ComplÃ©tÃ© : Ã‰valuation PÃ©riode d'Essai - " + nomSalarie;
        String corps = String.format(
                "Bonjour l'Ã©quipe RH,\n\n" +
                "Le responsable %s vient de soumettre la fiche d'Ã©valuation de la pÃ©riode d'essai de %s (Matricule: %s).\n\n" +
                "Note Globale : %.2f / 5\n\n" +
                "Vous pouvez consulter le dossier sur la plateforme :\n" +
                "https://auditessai-rh.vercel.app/admin/evaluations/%d\n\n" +
                "Cordialement,\nAuditEssai RH",
                nomManager, nomSalarie, periode.getSalarie().getMatricule(), periode.getNoteGlobale(), periode.getId()
        );

        for (User admin : admins) {
            boolean succes = dispatchEmail(admin.getEmail(), objet, corps);
            logHistorique(periode, admin.getEmail(), "Admin RH", RoleDestinataire.RH, objet, TypeEmail.CONFIRMATION_RH, corps, null, succes);
        }
    }

    @Override
    @Transactional
    public void sendConfirmationRH(PeriodeEvaluation periode, String decision) {
        log.info("Notification de dÃ©cision RH ({}) enregistrÃ©e pour le salariÃ© ID: {}", decision, periode.getSalarie().getId());
    }

    private void sendEmailAvecTemplate(PeriodeEvaluation periode, TypeEmail typeEmail) {
        TemplateEmail template = templateEmailRepository.findByTypeEmail(typeEmail)
                .orElseThrow(() -> new RuntimeException("Template non trouvÃ© pour : " + typeEmail));

        String destinataire = periode.getResponsable().getEmail();
        String nomSalarie = periode.getSalarie().getFirstName() + " " + periode.getSalarie().getLastName();
        String nomResponsable = periode.getResponsable().getFirstName() + " " + periode.getResponsable().getLastName();
        String lienSecurise = APP_URL + periode.getTokenAccesSalarie();

        String objet = template.getObjet().replace("{salarie}", nomSalarie);
        String corps = template.getContenu()
                .replace("{responsable}", nomResponsable)
                .replace("{salarie}", nomSalarie)
                .replace("{echeance}", periode.getDateEcheance().toString())
                .replace("{lien}", lienSecurise);

        boolean succes = dispatchEmail(destinataire, objet, corps);
        logHistorique(periode, destinataire, nomResponsable, RoleDestinataire.RESPONSABLE, objet, typeEmail, corps, lienSecurise, succes);
    }

    private boolean dispatchEmail(String to, String subject, String body) {
        try {
            ParametresCompte params = parametresCompteRepository.findFirstByOrderByIdAsc().orElse(null);
            String fromEmail = (params != null && params.getEmailExpediteur() != null) ? params.getEmailExpediteur() : "rh@groupe-premium.ma";

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, false);

            mailSender.send(message);
            log.info("E-mail envoyÃ© avec succÃ¨s Ã  : {}", to);
            return true;
        } catch (Exception e) {
            log.error("Erreur d'envoi d'e-mail Ã  {} : {}", to, e.getMessage());
            return false;
        }
    }

    private void logHistorique(PeriodeEvaluation periode, String dest, String destNom, RoleDestinataire role, String objet, TypeEmail type, String corps, String lien, boolean succes) {
        HistoriqueEmail histo = HistoriqueEmail.builder()
                .salarie(periode.getSalarie())
                .salarieNom(periode.getSalarie().getFirstName() + " " + periode.getSalarie().getLastName())
                .destinataire(dest)
                .destinataireNom(destNom)
                .roleDestinataire(role)
                .objet(objet)
                .typeEmail(type)
                .dateEnvoi(LocalDate.now())
                .heureEnvoi(LocalTime.now())
                .statut(succes ? StatutEmail.DELIVRE.name() : StatutEmail.ECHEC.name())
                .batchCron(true)
                .contenuCorps(corps)
                .lienSecurise(lien)
                .build();

        historiqueEmailRepository.save(histo);
    }
}