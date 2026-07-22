package com.bookloop.api.book;

import com.bookloop.api.book.dto.BookRequestDTO;
import com.bookloop.api.book.dto.BookResponseDTO;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<BookResponseDTO> findByFilter(
            @RequestParam(defaultValue = "")
            String search,
            @PageableDefault(size = 10)
            Pageable pageable
    ) {
        return bookService.findByFilter(
                search,
                pageable
        );
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public BookResponseDTO findById(@PathVariable Long id){
        return bookService.findById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public BookResponseDTO update(@PathVariable Long id, @Valid @RequestBody BookRequestDTO dto){
        return bookService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        bookService.delete(id);
    }

}
