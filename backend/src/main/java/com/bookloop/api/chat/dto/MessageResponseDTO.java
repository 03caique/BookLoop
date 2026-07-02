package com.bookloop.api.chat.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageResponseDTO {

    private Long id;

    private Long senderId;
    private String senderName;

    private Long receiverId;
    private String receiverName;

    private String content;

    private LocalDateTime sentAt;

}