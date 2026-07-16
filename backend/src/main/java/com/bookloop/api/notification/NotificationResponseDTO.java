package com.bookloop.api.notification;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class NotificationResponseDTO {

    private Long id;

    private String title;

    private String message;

    private NotificationType type;

    private Boolean read;

    private LocalDateTime createdAt;

}
