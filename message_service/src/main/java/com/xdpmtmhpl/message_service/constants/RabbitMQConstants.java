package com.xdpmtmhpl.message_service.constants;

public final class RabbitMQConstants {
    // Exchange names
    public static final String MAIN_EXCHANGE = "application.exchange";
    public static final String DLX_EXCHANGE = "application.dlx";
    public static final String BROADCAST_EXCHANGE = "application.broadcast";

    // Routing key patterns
    public static final String SERVICE_QUEUE_PATTERN = "%s.queue";
    public static final String SERVICE_DLQ_PATTERN = "%s.dlq";
    public static final String SERVICE_ROUTING_KEY_PATTERN = "service.%s";
    public static final String TOPIC_ROUTING_KEY_PATTERN = "topic.%s";

    // Dead letter routing key pattern
    public static final String DLQ_ROUTING_KEY_PATTERN = "dlq.%s";

    // === RPC Config ===
    public static final String USER_RPC_EXCHANGE = "user.rpc.exchange";
    public static final String USER_RPC_QUEUE = "user.rpc.queue";
    public static final String USER_RPC_ROUTING_KEY = "user.rpc";

    private RabbitMQConstants() {
        // Prevent instantiation
    }
}
