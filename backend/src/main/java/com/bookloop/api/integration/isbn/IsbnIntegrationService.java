package com.bookloop.api.integration.isbn;

import com.bookloop.api.integration.isbn.openlibrary.OpenLibraryBook;
import lombok.AllArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@AllArgsConstructor
public class IsbnIntegrationService {

    private final RestTemplate restTemplate;

    private static final String OPEN_LIBRARY_URL =
            "https://openlibrary.org/api/books?bibkeys=ISBN:%s&format=json&jscmd=data";

    public IsbnResponseDTO findByIsbn(String isbn) {

        if (isbn == null || isbn.isBlank()) {
            return fallback();
        }

        String url = String.format(OPEN_LIBRARY_URL, isbn);

        try {

            ResponseEntity<Map<String, OpenLibraryBook>> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.GET,
                            null,
                            new ParameterizedTypeReference<Map<String, OpenLibraryBook>>() {}
                    );

            Map<String, OpenLibraryBook> books = response.getBody();

            if (books == null || books.isEmpty()) {
                return fallback();
            }

            OpenLibraryBook book = books.get("ISBN:" + isbn);

            if (book == null) {
                return fallback();
            }

            if (book.getTitle() == null || book.getTitle().isBlank()) {
                return fallback();
            }

            IsbnResponseDTO responseDTO = new IsbnResponseDTO();

            responseDTO.setFound(true);
            responseDTO.setTitle(book.getTitle());

            if (book.getAuthors() == null || book.getAuthors().isEmpty()) {
                responseDTO.setAuthor(null);
            } else {
                responseDTO.setAuthor(
                        book.getAuthors()
                                .getFirst()
                                .getName()
                );
            }

            return responseDTO;

        } catch (RestClientException e) {
            e.printStackTrace();
            return fallback();
        }
    }

    private IsbnResponseDTO fallback() {

        IsbnResponseDTO dto = new IsbnResponseDTO();

        dto.setFound(false);
        dto.setTitle(null);
        dto.setAuthor(null);

        return dto;
    }
}