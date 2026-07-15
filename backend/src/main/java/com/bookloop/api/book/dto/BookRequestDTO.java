package com.bookloop.api.book.dto;

import com.bookloop.api.book.BookStatus;
import com.bookloop.api.book.photo.BookPhoto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

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

    private List<String> photos;

}
