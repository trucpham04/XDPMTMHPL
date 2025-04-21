package com.xdpmtmhpl.message_service.listener;

import com.xdpmtmhpl.message_service.models.EventMessage;
import com.xdpmtmhpl.message_service.service.ChatService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class RabbitMQListener {

    private final ChatService chatService;

    public RabbitMQListener(ChatService chatService) {
        this.chatService = chatService;
    }

    // Lắng nghe message từ queue của message_service
    @RabbitListener(queues = "${rabbitmq.queue.message}")
    public void listenForMessage(EventMessage<?> eventMessage) {
        // Xử lý message nhận được
        String messageType = eventMessage.getMessageType();
        // Tùy vào loại message, bạn có thể gọi các phương thức xử lý trong ChatService
        if ("USER_INFO_REQUEST".equals(messageType)) {
            // Giả sử bạn đang xử lý thông tin người dùng
            // Xử lý message hoặc call service tương ứng
            // chatService.handleUserInfoRequest(eventMessage);
        }
        // Các loại message khác
    }
}
