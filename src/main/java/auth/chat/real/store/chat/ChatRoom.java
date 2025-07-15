package auth.chat.real.store.chat;


import auth.chat.real.store.entity.AbstractBaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "room")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoom extends AbstractBaseEntity {

    private String chatId;
    private String senderId;
    private String recipientId;
}
