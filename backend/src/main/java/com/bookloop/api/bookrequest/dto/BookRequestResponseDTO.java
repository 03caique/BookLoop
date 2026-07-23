package com.bookloop.api.bookrequest.dto;

import com.bookloop.api.bookrequest.BookRequestStatus;
import com.bookloop.api.socioeconomicprofile.EducationLevel;
import com.bookloop.api.socioeconomicprofile.PriorityLevel;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class BookRequestResponseDTO {

    private Long id;
    private BookRequestStatus status;

    private Long bookId;
    private String bookTitle;

    private Long requesterId;
    private String requesterName;

    private PriorityLevel priorityLevel;

    private boolean hasSocioeconomicProfile;
}