package com.bookloop.api.user.service;

import com.bookloop.api.user.User;
import com.bookloop.api.user.UserRepository;
import com.bookloop.api.user.dto.LoginRequestDTO;
import com.bookloop.api.user.dto.LoginResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponseDTO login(LoginRequestDTO dto){
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos");

        String token = UUID.randomUUID().toString();
        LoginResponseDTO response = new LoginResponseDTO();

        response.setToken(token);
        response.setUserId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());

        return response;
    }

}
