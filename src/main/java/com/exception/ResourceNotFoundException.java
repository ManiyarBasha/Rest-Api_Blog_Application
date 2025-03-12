package com.exception;

public class ResourceNotFoundException extends RuntimeException {  // Extending RuntimeException
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
