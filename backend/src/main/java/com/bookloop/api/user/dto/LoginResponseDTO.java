package com.bookloop.api.user.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private String token;
    private Long userId;
    private String name;
    private String email;
}
