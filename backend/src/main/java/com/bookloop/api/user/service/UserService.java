package com.bookloop.api.user.service;

import com.bookloop.api.security.LoggedUserService;
import com.bookloop.api.user.User;
import com.bookloop.api.user.UserRepository;
import com.bookloop.api.user.dto.*;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final LoggedUserService loggedUserService;

    public UserResponseDTO createUser(UserRequestDTO dto){
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        }

        User user = modelMapper.map(dto, User.class);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);

        return modelMapper.map(savedUser, UserResponseDTO.class);
    }

    public UserResponseDTO findById(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return modelMapper.map(user, UserResponseDTO.class);
    }

    public UserResponseDTO update(Long id, UserUpdateDTO updateDTO){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        User loggedUser = loggedUserService.getLoggedUser();

        if (!loggedUser.getId().equals(id)) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Você não pode editar outro usuário"
            );
        }

        if (updateDTO.getName() != null){
            user.setName(updateDTO.getName());
        }

        if (updateDTO.getEmail() != null){
            user.setEmail(updateDTO.getEmail());
        }

        userRepository.save(user);

        return modelMapper.map(user, UserResponseDTO.class);
    }

}
