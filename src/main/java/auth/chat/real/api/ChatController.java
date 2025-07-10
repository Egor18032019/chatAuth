package auth.chat.real.api;

import auth.chat.real.model.ChatMessage;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

import static auth.chat.real.utils.EndPointWebSocket.QUEUE_MESSAGE;

@RestController
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate template;


    @PostMapping(value = "/api/send", consumes = "application/json", produces = "application/json")
    public void sendMessage(@RequestBody ChatMessage message,
                            @RequestHeader Map<String, String> headers) throws JsonProcessingException {
        System.out.println("headers = " + headers);
        message.setTimestamp(LocalDateTime.now().toString());
//        template.convertAndSend(message.getSender(), message);
//        template.convertAndSend(TOPIC_GROUP, message);
        template.convertAndSendToUser(message.getSender(),
                QUEUE_MESSAGE,
                message);
//        template.convertAndSendToUser(message.getSenderId(),
//                QUEUE_MESSAGE,
//                message);
    }
}
