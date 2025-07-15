package auth.chat.real.model;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {

    private String sender;
    private String content;
    private LocalDateTime timestamp = LocalDateTime.now();
}
