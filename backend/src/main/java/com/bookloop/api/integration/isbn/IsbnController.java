package com.bookloop.api.integration.isbn;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/isbn")
@AllArgsConstructor
public class IsbnController {

    private final IsbnIntegrationService isbnIntegrationService;

    @GetMapping("/{isbn}")
    public IsbnResponseDTO findByIsbn(@PathVariable String isbn) {
        return isbnIntegrationService.findByIsbn(isbn);
    }
}