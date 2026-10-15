package com.premium.essai.service;

import com.premium.essai.entity.Notification;
import com.premium.essai.enums.CibleRole;

import java.util.List;

public interface NotificationService {
    void creerAlerte(String titre, String message, CibleRole cibleRole);
    List<Notification> getNotificationsNonLues(CibleRole cibleRole);
    void marquerCommeLue(Long notificationId);
}