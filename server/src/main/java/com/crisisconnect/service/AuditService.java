package com.crisisconnect.service;

import com.crisisconnect.entity.AuditLog;
import com.crisisconnect.entity.Notification;
import com.crisisconnect.entity.User;
import com.crisisconnect.repository.AuditLogRepository;
import com.crisisconnect.repository.NotificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final NotificationRepository notificationRepository;

    public AuditService(AuditLogRepository auditLogRepository, NotificationRepository notificationRepository) {
        this.auditLogRepository = auditLogRepository;
        this.notificationRepository = notificationRepository;
    }

    public void log(Long actorId, String actorName, String action, String entityType, Long entityId, String details) {
        AuditLog log = new AuditLog();
        log.setActorId(actorId);
        log.setActorName(actorName);
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setDetails(details);
        auditLogRepository.save(log);
    }

    public void logPublic(String action, String entityType, Long entityId, String details) {
        log(null, "PUBLIC", action, entityType, entityId, details);
    }

    public void notify(User user, String title, String message, Notification.Type type, String refType, Long refId) {
        Notification n = new Notification();
        n.setUser(user);
        n.setTitle(title);
        n.setMessage(message);
        n.setType(type);
        n.setReferenceType(refType);
        n.setReferenceId(refId);
        notificationRepository.save(n);
    }

    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public Page<Notification> getNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsRead(userId, false);
    }

    public void markNotificationRead(Long notificationId, Long userId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getUser().getId().equals(userId)) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        });
    }

    public void markAllRead(Long userId) {
        notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, Pageable.unpaged())
                .forEach(n -> {
                    if (!n.getIsRead()) {
                        n.setIsRead(true);
                        notificationRepository.save(n);
                    }
                });
    }
}
