package com.example.carslocation.common.error;

import java.time.OffsetDateTime;

public record ApiError(OffsetDateTime timestamp, int status, String errorCode, String message, String path) {
}
