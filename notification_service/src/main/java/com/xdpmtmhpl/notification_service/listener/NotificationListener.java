package com.xdpmtmhpl.notification_service.listener;

import com.xdpmtmhpl.notification_service.dto.NotificationRequest;
import com.xdpmtmhpl.notification_service.models.Notification;
import com.xdpmtmhpl.notification_service.service.NotificationService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class NotificationListener {

    @Autowired
    private NotificationService notificationService;

    @RabbitListener(queues = "notification_service.queue")
    @Transactional
    public void receiveNotification(NotificationRequest notificationRequest) {
        try {
            Notification notification = notificationService.createNotification(notificationRequest);

            notificationService.sendNotificationToUser(notificationRequest.getUserId(), notification);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
