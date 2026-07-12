package com.bookloop.api.match;

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
}