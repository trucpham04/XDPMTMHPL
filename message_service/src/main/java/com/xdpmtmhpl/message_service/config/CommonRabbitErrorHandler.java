package com.xdpmtmhpl.message_service.config;

import org.springframework.amqp.rabbit.listener.ConditionalRejectingErrorHandler;
import org.springframework.amqp.rabbit.support.ListenerExecutionFailedException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.ErrorHandler;

@Configuration
public class CommonRabbitErrorHandler {

    @Bean
    public ErrorHandler errorHandler() {
        return new ConditionalRejectingErrorHandler(new CustomExceptionStrategy());
    }

    public static class CustomExceptionStrategy extends ConditionalRejectingErrorHandler.DefaultExceptionStrategy {
        @Override
        public boolean isFatal(Throwable t) {
            if (t instanceof ListenerExecutionFailedException) {
                ListenerExecutionFailedException lefex = (ListenerExecutionFailedException) t;
                return !(lefex.getCause() instanceof com.xdpmtmhpl.message_service.exception.MessageProcessingException)
                        && super.isFatal(t);
            }
            return super.isFatal(t);
        }
    }
}
