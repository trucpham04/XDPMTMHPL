package com.xdpmtmhpl.message_service.exception;

public class MessageProcessingException extends RuntimeException {

    private final boolean requeue;

    public MessageProcessingException(String message) {
        this(message, false);
    }

    public MessageProcessingException(String message, boolean requeue) {
        super(message);
        this.requeue = requeue;
    }

    public MessageProcessingException(String message, Throwable cause) {
        this(message, cause, false);
    }

    public MessageProcessingException(String message, Throwable cause, boolean requeue) {
        super(message, cause);
        this.requeue = requeue;
    }

    public boolean isRequeue() {
        return requeue;
    }
}
