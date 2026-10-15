package com.premium.essai.service.impl;

import com.premium.essai.entity.Notification;
import com.premium.essai.enums.CibleRole;
import com.premium.essai.repository.NotificationRepository;
import com.premium.essai.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public void creerAlerte(String titre, String message, CibleRole cibleRole) {
        Notification notification = Notification.builder()
                .titre(titre)
                .message(message)
                .cibleRole(cibleRole)
                .estLue(false)
                .dateCreation(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getNotificationsNonLues(CibleRole cibleRole) {
        return notificationRepository.findByCibleRoleAndEstLueFalseOrderByDateCreationDesc(cibleRole);
    }

    @Override
    @Transactional
    public void marquerCommeLue(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée ID: " + notificationId));
        notification.setEstLue(true);
        notificationRepository.save(notification);
    }
}