package com.bookloop.api.socioeconomicprofile;

import com.bookloop.api.socioeconomicprofile.dto.SocioeconomicProfileRequestDTO;
import com.bookloop.api.socioeconomicprofile.dto.SocioeconomicProfileResponseDTO;
import com.bookloop.api.user.User;
import com.bookloop.api.user.UserRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
public class SocioeconomicProfileService {

    private final SocioeconomicProfileRepository repository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public SocioeconomicProfileResponseDTO create(SocioeconomicProfileRequestDTO dto){
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = authentication.getName();

        User loggedUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        if (repository.existsByUserId(loggedUser.getId())){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um perfil socioeconomico para esse usuário");
        }

        SocioeconomicProfile seProfile = modelMapper.map(dto, SocioeconomicProfile.class);
        seProfile.setUser(loggedUser);
        SocioeconomicProfile savedSep = repository.save(seProfile);

        return modelMapper.map(savedSep, SocioeconomicProfileResponseDTO.class);
    }

}
