package com.bookloop.api.transaction;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class TransactionResponseDTO {

    private Long id;
    private TransactionStatus status;
    private Long matchId;
    private Long bookId;
    private String bookTitle;
    private Long proponentId;
    private String proponentName;
    private Long requesterId;
    private String requesterName;
    private LocalDateTime createdAt;
    private TransactionType type;
    private Long otherUserId;
    private String otherUserName;

}
