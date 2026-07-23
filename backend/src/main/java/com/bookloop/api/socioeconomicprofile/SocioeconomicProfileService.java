package com.bookloop.api.socioeconomicprofile;

import com.bookloop.api.security.LoggedUserService;
import com.bookloop.api.socioeconomicprofile.dto.SocioeconomicProfileRequestDTO;
import com.bookloop.api.socioeconomicprofile.dto.SocioeconomicProfileResponseDTO;
import com.bookloop.api.socioeconomicprofile.dto.SocioeconomicProfileUpdateDTO;
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
    private final LoggedUserService loggedUserService;

    public SocioeconomicProfileResponseDTO create(SocioeconomicProfileRequestDTO dto){
        User loggedUser = loggedUserService.getLoggedUser();

        if (repository.existsByUserId(loggedUser.getId())){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um perfil socioeconomico para esse usuário");
        }

        SocioeconomicProfile seProfile = modelMapper.map(dto, SocioeconomicProfile.class);
        seProfile.setUser(loggedUser);
        SocioeconomicProfile savedSep = repository.save(seProfile);

        return modelMapper.map(savedSep, SocioeconomicProfileResponseDTO.class);
    }

    public SocioeconomicProfileResponseDTO findByUserId(Long userId) {
        User loggedUser = loggedUserService.getLoggedUser();

        if (!loggedUser.getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não possui permissão para acessar este perfil socioeconômico");
        }

        SocioeconomicProfile profile = repository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil socioeconômico não encontrado"));

        return modelMapper.map(profile, SocioeconomicProfileResponseDTO.class);
    }

    public SocioeconomicProfileResponseDTO update(Long userId, SocioeconomicProfileUpdateDTO dto) {
        User loggedUser = loggedUserService.getLoggedUser();

        if (!loggedUser.getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não possui permissão para editar este perfil socioeconômico");
        }

        SocioeconomicProfile profile = repository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil socioeconômico não encontrado"));

        profile.setFamilyIncome(dto.getFamilyIncome());
        profile.setEducationLevel(dto.getEducationLevel());
        profile.setHouseholdSize(dto.getHouseholdSize());
        profile.setWorkSituation(dto.getWorkSituation());

        SocioeconomicProfile updatedProfile = repository.save(profile);

        return modelMapper.map(updatedProfile, SocioeconomicProfileResponseDTO.class);
    }

}
