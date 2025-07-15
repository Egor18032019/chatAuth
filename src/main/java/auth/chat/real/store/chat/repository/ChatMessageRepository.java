package auth.chat.real.store.chat.repository;

import auth.chat.real.store.chat.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatIdOrderByTimestampAsc(String roomId);
}

