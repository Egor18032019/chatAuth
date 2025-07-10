package auth.chat.real.model;

import auth.chat.real.utils.MessageStatus;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
//    private String chatId;
//    private String senderId;
//    private String recipientId;
//    private String senderName;
//    private MessageStatus status;


    private String sender;
    private String content;
    private String timestamp;

    public ChatMessage(String sender, String content) {
        this.sender = sender;
        this.content = content;
    }

}
