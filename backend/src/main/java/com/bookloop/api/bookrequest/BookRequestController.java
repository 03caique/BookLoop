package com.bookloop.api.bookrequest;

import com.bookloop.api.bookrequest.dto.BookRequestRequestDTO;
import com.bookloop.api.bookrequest.dto.BookRequestResponseDTO;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
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

}
