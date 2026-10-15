package com.premium.essai.controller;

import com.premium.essai.entity.Notification;
import com.premium.essai.enums.CibleRole;
import com.premium.essai.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "3. Notifications", description = "APIs pour le centre d'alertes instantanées du Dashboard RH")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/non-lues")
    @Operation(summary = "Récupérer toutes les notifications non lues pour l'équipe RH")
    public ResponseEntity<List<Notification>> getNotificationsNonLues() {
        return ResponseEntity.ok(notificationService.getNotificationsNonLues(CibleRole.ALL_RH));
    }

    @PutMapping("/{id}/lire")
    @Operation(summary = "Marquer une notification comme lue")
    public ResponseEntity<Void> marquerCommeLue(@PathVariable Long id) {
        notificationService.marquerCommeLue(id);
        return ResponseEntity.noContent().build();
    }
}