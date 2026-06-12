package com.bookloop.api.bookrequest.dto;

import com.bookloop.api.bookrequest.BookRequestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookRequestUpdateDTO {
    @NotNull
    private BookRequestStatus status;
}
