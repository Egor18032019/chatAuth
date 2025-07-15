package auth.chat.real.api;

import auth.chat.real.model.ChatMessageDTO;
import auth.chat.real.service.ChatRoomService;
import auth.chat.real.store.chat.ChatMessage;
import auth.chat.real.store.chat.repository.ChatMessageRepository;
import auth.chat.real.utils.EndPoint;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static auth.chat.real.utils.EndPointWebSocket.QUEUE_MESSAGE;

@RestController
@RequestMapping(EndPoint.API)
@Tag(name = "Chat Controller", description = "Контроллер для чата")
public class ChatController {
    private final SimpMessagingTemplate template;
    private final ChatMessageRepository messageRepository;
    private final ChatRoomService chatRoomService;

    public ChatController(SimpMessagingTemplate template, ChatMessageRepository messageRepository, ChatRoomService chatRoomService) {
        this.template = template;
        this.messageRepository = messageRepository;
        this.chatRoomService = chatRoomService;
    }


    @PostMapping(value = "/send", consumes = "application/json", produces = "application/json")
    public void sendMessage(@RequestBody ChatMessageDTO messageDTO,
                            @RequestHeader Map<String, String> headers) throws JsonProcessingException {


        ChatMessage message = new ChatMessage();
        message.setChatId(messageDTO.getChatId());
        message.setSender(messageDTO.getSender());

        message.setContent(messageDTO.getContent());
        message.setTimestamp(messageDTO.getTimestamp() != null ? messageDTO.getTimestamp() : LocalDateTime.now());
        message.setStatus(messageDTO.getStatus());

        ChatMessage saved = messageRepository.save(message);

//        template.convertAndSend(message.getSender(), message);
//        template.convertAndSend(TOPIC_GROUP, message);
        template.convertAndSendToUser(messageDTO.getChatId(), //todo обдумать логику
                QUEUE_MESSAGE,
                saved);
//        template.convertAndSendToUser(message.getSenderId(),
//                QUEUE_MESSAGE,
//                message);
    }


    @GetMapping("/chat/history/{roomId}")
    public List<ChatMessage> getHistory(@PathVariable String roomId) {

        return messageRepository.findByChatIdOrderByTimestampAsc(roomId);
    }
}
