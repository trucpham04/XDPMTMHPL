package com.xdpmtmhpl.message_service.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQListenerConfig {

    @Bean
    public TopicExchange topicExchange() {
        return new TopicExchange("application.exchange");
    }

    @Bean
    public Binding binding(Queue messageQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(messageQueue).to(topicExchange).with("service.#"); // Routing key pattern
    }
}
