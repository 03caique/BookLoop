package com.bookloop.api.socioeconomicprofile;

import com.bookloop.api.socioeconomicprofile.dto.SocioeconomicProfileRequestDTO;
import com.bookloop.api.socioeconomicprofile.dto.SocioeconomicProfileResponseDTO;
import com.bookloop.api.socioeconomicprofile.dto.SocioeconomicProfileUpdateDTO;
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

    @GetMapping("/{userId}")
    public SocioeconomicProfileResponseDTO findByUserId(@PathVariable Long userId) {
        return service.findByUserId(userId);
    }

    @PutMapping("/{userId}")
    public SocioeconomicProfileResponseDTO update(
            @PathVariable Long userId,
            @Valid @RequestBody SocioeconomicProfileUpdateDTO dto
    ) {
        return service.update(userId, dto);
    }
}
