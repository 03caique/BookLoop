package com.bookloop.api.bookrequest;

import com.bookloop.api.bookrequest.dto.BookRequestRequestDTO;
import com.bookloop.api.bookrequest.dto.BookRequestResponseDTO;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/book-requests")
public class BookRequestController {

    private final BookRequestService bookRequestService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookRequestResponseDTO create(@Valid @RequestBody BookRequestRequestDTO requestDTO){
        return bookRequestService.create(requestDTO);
    }

    @GetMapping
    public Page<BookRequestResponseDTO> findByProponent(@RequestParam Long proponentId, Pageable pageable) {
        return bookRequestService.findByProponent(proponentId, pageable);
    }
}
