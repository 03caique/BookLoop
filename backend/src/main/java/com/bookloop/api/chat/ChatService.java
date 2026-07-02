package com.bookloop.api.chat;

import com.bookloop.api.book.dto.BookResponseDTO;
import com.bookloop.api.chat.dto.MessageRequestDTO;
import com.bookloop.api.chat.dto.MessageResponseDTO;
import com.bookloop.api.match.MatchRepository;
import com.bookloop.api.match.MatchService;
import com.bookloop.api.user.User;
import com.bookloop.api.user.UserRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final MatchRepository matchRepository;

    public MessageResponseDTO create(MessageRequestDTO requestDTO){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();
        User loggedUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        User receiver = userRepository.findById(requestDTO.getReceiverId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        if (loggedUser.getId().equals(receiver.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível enviar mensagens para si mesmo.");
        }

        Long userAId = Math.min(loggedUser.getId(), receiver.getId());
        Long userBId = Math.max(loggedUser.getId(), receiver.getId());
        if (!matchRepository.existsByUserAIdAndUserBId(userAId, userBId)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Os usuários não possuem um match ativo");
        }

        Message message = new Message();

        message.setSender(loggedUser);
        message.setContent(requestDTO.getContent());
        message.setReceiver(receiver);

        Message savedMessage = messageRepository.save(message);
        MessageResponseDTO responseDTO = modelMapper.map(savedMessage, MessageResponseDTO.class);

        responseDTO.setSenderId(loggedUser.getId());
        responseDTO.setSenderName(loggedUser.getName());

        responseDTO.setReceiverId(receiver.getId());
        responseDTO.setReceiverName(receiver.getName());

        return responseDTO;
    }

    public Page<MessageResponseDTO> findConversation(Long userId, Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();
        User loggedUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        User receiver = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        Long userAId = Math.min(loggedUser.getId(), receiver.getId());
        Long userBId = Math.max(loggedUser.getId(), receiver.getId());
        if (!matchRepository.existsByUserAIdAndUserBId(userAId, userBId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Os usuários não possuem um match ativo");
        }

        Page<Message> messages = messageRepository.findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderBySentAtAsc(
                loggedUser.getId(),
                receiver.getId(),
                receiver.getId(),
                loggedUser.getId(),
                pageable);

        return messages.map(message -> {
            MessageResponseDTO dto = modelMapper.map(message, MessageResponseDTO.class);

            dto.setSenderId(message.getSender().getId());
            dto.setSenderName(message.getSender().getName());

            dto.setReceiverId(message.getReceiver().getId());
            dto.setReceiverName(message.getReceiver().getName());

            return dto;
        });
    }

}
