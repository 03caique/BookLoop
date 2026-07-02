package com.bookloop.api.chat;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderBySentAtAsc(
            Long senderId,
            Long receiverId,
            Long receiverId2,
            Long senderId2,
            Pageable pageable
    );

}
