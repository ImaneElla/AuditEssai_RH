package com.premium.essai.repository;

import com.premium.essai.model.Notification;
import com.premium.essai.model.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByCibleRoleAndEstLueFalse(UserRole cibleRole);
    
    List<Notification> findByEstLueFalse();
}