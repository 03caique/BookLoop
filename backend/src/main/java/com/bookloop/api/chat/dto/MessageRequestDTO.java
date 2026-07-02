package com.bookloop.api.chat.dto;

import com.bookloop.api.user.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MessageRequestDTO {

    @NotNull
    private Long receiverId;

    @NotBlank
    private String content;

}
