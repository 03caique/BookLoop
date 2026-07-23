package com.bookloop.api.match;

import com.bookloop.api.transaction.TransactionStatus;
import lombok.Data;

@Data
public class MatchResponseDTO {

    private Long matchId;

    private Long otherUserId;
    private String otherUserName;

    private Long myBookId;
    private String myBookTitle;

    private Long otherBookId;
    private String otherBookTitle;

    private Long myTransactionId;
    private TransactionStatus myTransactionStatus;
}