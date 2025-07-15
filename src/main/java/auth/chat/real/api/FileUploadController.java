package auth.chat.real.api;

import auth.chat.real.model.ChatMessageDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.UUID;

import static auth.chat.real.utils.EndPointWebSocket.QUEUE_MESSAGE;

@RestController
@RequestMapping("/files")

public class FileUploadController {
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final SimpMessagingTemplate template;
    //Здесь мы сохраняем файлы в папку uploads и возвращаем ссылку для скачивания.
    //todoД переделать на s3 ?
    private final Path uploadDir = Paths.get("uploads");

    public FileUploadController(SimpMessagingTemplate template) throws Exception {
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

        template.convertAndSendToUser(message.getChatId(),
                QUEUE_MESSAGE,
                message);
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
