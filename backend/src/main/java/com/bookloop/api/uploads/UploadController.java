package com.bookloop.api.uploads;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class UploadController {

    private final UploadService uploadService;

    @PostMapping
    public ResponseEntity<String> upload(
            @RequestParam("file") MultipartFile file
    ) {

        String url = uploadService.upload(file);

        return ResponseEntity.ok(url);
    }
}