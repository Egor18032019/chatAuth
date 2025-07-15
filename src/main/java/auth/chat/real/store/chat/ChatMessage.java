package auth.chat.real.store.chat;


import auth.chat.real.store.entity.AbstractBaseEntity;
import auth.chat.real.utils.MessageStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage extends AbstractBaseEntity {
    private String chatId;
    private String sender;
    private String content;
    private LocalDateTime timestamp;
    private MessageStatus status;

}
