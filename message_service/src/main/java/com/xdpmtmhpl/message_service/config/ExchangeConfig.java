package com.xdpmtmhpl.message_service.config;

import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ExchangeConfig {

    // Main application exchange
    @Bean
    public TopicExchange applicationExchange() {
        return new TopicExchange("message_service.exchange", true, false);
    }

    // Dead letter exchange
    @Bean
    public DirectExchange deadLetterExchange() {
        return new DirectExchange("message_service.dlx", true, false);
    }

    // Broadcast exchange for messages to all services
    @Bean
    public FanoutExchange broadcastExchange() {
        return new FanoutExchange("message_service.broadcast", true, false);
    }
}
