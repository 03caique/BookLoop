package com.bookloop.api.bookrequest.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookRequestRequestDTO {

    @NotNull
    private Long bookId;
    @NotNull
    private Long requesterId;

}
