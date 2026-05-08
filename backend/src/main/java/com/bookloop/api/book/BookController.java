package com.bookloop.api.book;

import com.bookloop.api.book.dto.BookRequestDTO;
import com.bookloop.api.book.dto.BookResponseDTO;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/books")
@AllArgsConstructor
public class BookController {

    private final BookService bookService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookResponseDTO create(@Valid @RequestBody BookRequestDTO dto){
        return bookService.create(dto);
    }
}
