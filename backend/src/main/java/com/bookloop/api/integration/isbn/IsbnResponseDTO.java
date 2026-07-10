package com.bookloop.api.integration.isbn;

import lombok.Data;

@Data
public class IsbnResponseDTO {

    private String title;
    private String author;
    private boolean found;

}
