package auth.chat.real.api;

import auth.chat.real.model.ChatMessageDTO;
import auth.chat.real.store.chat.ChatMessage;
import auth.chat.real.store.chat.repository.ChatMessageRepository;
import auth.chat.real.utils.EndPoint;
import auth.chat.real.utils.MessageStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.UUID;

import static auth.chat.real.utils.EndPointWebSocket.QUEUE_MESSAGE;

@RestController
@RequestMapping(EndPoint.FILES)
public class FileUploadController {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ChatMessageRepository messageRepository;
    private final SimpMessagingTemplate template;
    //Здесь мы сохраняем файлы в папку uploads и возвращаем ссылку для скачивания.
    //todoД переделать на s3 ?
    private final Path uploadDir = Paths.get("uploads");

    public FileUploadController(ChatMessageRepository messageRepository, SimpMessagingTemplate template) throws Exception {
        this.messageRepository = messageRepository;
        this.template = template;
        Files.createDirectories(uploadDir);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("message") String messageJson) throws Exception {

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path targetPath = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        objectMapper.registerModule(new JavaTimeModule());
//        Разбираем JSON
        ChatMessageDTO message = objectMapper.readValue(messageJson, ChatMessageDTO.class);
        String fileUrl = "/files/download/" + filename;
        message.setContent("/files/download/" + filename);
        ChatMessage messageForSave = new ChatMessage();
        messageForSave.setChatId(message.getChatId());
        messageForSave.setSender(message.getSender());
        //todo html иньекция ? придумать лучше ?
        String url = """
                <a href="http://localhost:8080 
                """ + message.getContent() + "\"" + """
                   target="_blank" rel="noopener noreferrer">
                  Открыть Example.com
                </a>
                """;
        messageForSave.setContent(url);
        messageForSave.setTimestamp(message.getTimestamp() != null ? message.getTimestamp() : LocalDateTime.now());
        messageForSave.setStatus(MessageStatus.DELIVERED);

        ChatMessage saved = messageRepository.save(messageForSave);
        template.convertAndSendToUser(message.getChatId(),
                QUEUE_MESSAGE,
                saved);
        return ResponseEntity.ok(fileUrl);
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<byte[]> download(@PathVariable String filename) throws Exception {
        Path path = uploadDir.resolve(filename);
        byte[] data = Files.readAllBytes(path);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                .body(data);
    }
}
