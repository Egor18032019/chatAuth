package auth.chat.real.model;

import auth.chat.real.utils.MessageStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {
    private String chatId;
    private String sender;
    private String content;
    private LocalDateTime timestamp;
    private MessageStatus status;
}
