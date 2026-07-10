package com.bookloop.api.integration.isbn.openlibrary;

import lombok.Data;

import java.util.List;

@Data
public class OpenLibraryBook {

    private String title;
    private List<OpenLibraryAuthor> authors;

}
