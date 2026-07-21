package com.bookloop.api.chat;

import com.bookloop.api.book.dto.BookResponseDTO;
import com.bookloop.api.chat.dto.MessageRequestDTO;
import com.bookloop.api.chat.dto.MessageResponseDTO;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@AllArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public MessageResponseDTO create(@RequestBody @Valid MessageRequestDTO requestDTO){
        return chatService.create(requestDTO);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{receiverId}")
    public Page<MessageResponseDTO> findConversation(@PathVariable Long receiverId, @PageableDefault(size = 10) Pageable pageable){
        return chatService.findConversation(receiverId, pageable);
    }

    @GetMapping("/{receiverId}/new")
    @ResponseStatus(HttpStatus.OK)
    public List<MessageResponseDTO> findNewMessages(@PathVariable Long receiverId, @RequestParam LocalDateTime after) {
        return chatService.findNewMessages(receiverId, after);
    }

}

