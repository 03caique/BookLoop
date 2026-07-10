package com.bookloop.api.uploads;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class UploadService {

    private static final String UPLOAD_FOLDER = "uploads";

    private static final List<String> ALLOWED_TYPES = List.of("image/jpeg", "image/png", "image/webp");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    public String upload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nenhuma imagem foi enviada.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Formato de imagem não suportado.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A imagem deve ter no máximo 10 MB.");
        }

        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null || originalFilename.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome do arquivo inválido.");
        }

        if (!originalFilename.contains(".")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Arquivo sem extensão.");
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));

        String fileName = UUID.randomUUID() + extension;

        Path uploadPath = Paths.get(UPLOAD_FOLDER);

        try {

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath);

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao salvar a imagem.");
        }

        return "/uploads/" + fileName;
    }

}
