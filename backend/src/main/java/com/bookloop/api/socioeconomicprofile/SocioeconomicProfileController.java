package com.bookloop.api.socioeconomicprofile;

import com.bookloop.api.socioeconomicprofile.dto.SocioeconomicProfileRequestDTO;
import com.bookloop.api.socioeconomicprofile.dto.SocioeconomicProfileResponseDTO;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/socioeconomic-profile")
public class SocioeconomicProfileController {

    private final SocioeconomicProfileService service;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public SocioeconomicProfileResponseDTO create(@Valid @RequestBody SocioeconomicProfileRequestDTO dto){
        return service.create(dto);
    }

}
