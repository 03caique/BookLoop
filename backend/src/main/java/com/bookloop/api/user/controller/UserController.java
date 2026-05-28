package com.bookloop.api.user.controller;

import com.bookloop.api.book.BookService;
import com.bookloop.api.book.dto.BookResponseDTO;
import com.bookloop.api.user.dto.UserUpdateDTO;
import com.bookloop.api.user.service.UserService;
import com.bookloop.api.user.dto.UserRequestDTO;
import com.bookloop.api.user.dto.UserResponseDTO;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final BookService bookService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public UserResponseDTO create(@RequestBody @Valid UserRequestDTO userRequestDTO){
        return userService.createUser(userRequestDTO);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{id}")
    public UserResponseDTO findById(@PathVariable Long id){
        return userService.findById(id);
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/{id}")
    public UserResponseDTO update(@PathVariable Long id, @RequestBody UserUpdateDTO updateDTO){
        return userService.update(id, updateDTO);
    }

    @GetMapping("/{id}/books")
    @ResponseStatus(HttpStatus.OK)
    public List<BookResponseDTO> findBooksByUserId(@PathVariable Long id){
        return bookService.findByUserId(id);
    }
}
