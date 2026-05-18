package com.bookloop.api.book.dto;

import com.bookloop.api.book.BookStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookRequestDTO {
    @NotBlank
    private String title;

    @NotBlank
    private String author;

    private String isbn;

    @NotBlank
    private String description;

    @NotNull
    private BookStatus status;

    @NotNull
    private Long userId;

}
