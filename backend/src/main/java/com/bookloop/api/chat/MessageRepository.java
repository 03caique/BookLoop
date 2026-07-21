package com.bookloop.api.chat;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderBySentAtAsc(
            Long senderId,
            Long receiverId,
            Long receiverId2,
            Long senderId2,
            Pageable pageable
    );

    @Query("""
                SELECT m FROM Message m
                WHERE 
                ((m.sender.id = :userId AND m.receiver.id = :otherUserId)
                OR
                (m.sender.id = :otherUserId AND m.receiver.id = :userId))
                AND m.sentAt > :after
                ORDER BY m.sentAt ASC
            """)
    List<Message> findNewMessages(
            @Param("userId") Long userId,
            @Param("otherUserId") Long otherUserId,
            @Param("after") LocalDateTime after
    );

}
