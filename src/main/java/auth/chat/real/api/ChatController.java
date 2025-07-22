package auth.chat.real.api;

import auth.chat.real.model.ChatMessageDTO;
import auth.chat.real.service.ProjectService;
import auth.chat.real.store.chat.ChatMessage;
import auth.chat.real.store.chat.repository.ChatMessageRepository;
import auth.chat.real.utils.EndPoint;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.swagger.v3.oas.annotations.tags.Tag;
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

    public ChatController(SimpMessagingTemplate template, ChatMessageRepository messageRepository, ProjectService projectService) {
        this.template = template;
        this.messageRepository = messageRepository;
    }

    /**
     * Отправляет сообщение в указанный чат.
     *
     * @param messageDTO тело сообщения
     * @param headers    заголовки запроса (используются?)
     */
    @PostMapping(value = EndPoint.SEND, consumes = "application/json", produces = "application/json")
    public void sendMessage(@RequestBody ChatMessageDTO messageDTO,
                            @RequestHeader Map<String, String> headers) throws JsonProcessingException {
        ChatMessage message = toEntity(messageDTO);
        ChatMessage saved = messageRepository.save(message);

        template.convertAndSendToUser(messageDTO.getChatId(), //todo обдумать логику
                QUEUE_MESSAGE,
                saved);

    }

    /**
     * Возвращает историю сообщений комнаты.
     *
     * @param roomId идентификатор комнаты
     * @return список сообщений, отсортированный по времени
     */
    @GetMapping(EndPoint.CHAT + EndPoint.HISTORY + "/{roomId}")
    public List<ChatMessage> getHistory(@PathVariable String roomId) {

        return messageRepository.findByChatIdOrderByTimestampAsc(roomId);
    }

    private ChatMessage toEntity(ChatMessageDTO dto) {
        ChatMessage entity = new ChatMessage();
        entity.setChatId(dto.getChatId());
        entity.setSender(dto.getSender());
        entity.setContent(dto.getContent());
        entity.setStatus(dto.getStatus());
        entity.setTimestamp(
                dto.getTimestamp() != null ? dto.getTimestamp() : LocalDateTime.now()
        );
        return entity;
    }
}
