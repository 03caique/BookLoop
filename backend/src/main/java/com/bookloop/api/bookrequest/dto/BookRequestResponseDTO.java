package com.bookloop.api.bookrequest.dto;

import com.bookloop.api.bookrequest.BookRequestStatus;
import lombok.Data;

@Data
public class BookRequestResponseDTO {

    private Long id;
    private BookRequestStatus status;
    private Long bookId;
    private Long requesterId;

}
