package com.premium.essai.service;

import com.premium.essai.entity.PeriodeEvaluation;

public interface MailService {
    void sendRappelJ21(PeriodeEvaluation periode);
    void sendRappelJ14(PeriodeEvaluation periode);
    void sendRappelJ7(PeriodeEvaluation periode);
    void sendAlerteRetard(PeriodeEvaluation periode, int joursRetard);
    void sendNotificationFormulaireRempliAuxAdmins(PeriodeEvaluation periode);
    void sendConfirmationRH(PeriodeEvaluation periode, String decision);
}