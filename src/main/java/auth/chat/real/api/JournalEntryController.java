package auth.chat.real.api;

import auth.chat.real.model.JournalEntryDto;
import auth.chat.real.model.JournalEntryResponse;
import auth.chat.real.store.journals.JournalEntry;
import auth.chat.real.store.journals.JournalEntryRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import static auth.chat.real.utils.UtilsFunctions.convertToEntity;
import static auth.chat.real.utils.UtilsFunctions.convertToResponse;

@RestController
@RequestMapping("/api/journal-entries")
public class JournalEntryController {
    JournalEntryRepository journalEntryRepository;

    public JournalEntryController(JournalEntryRepository journalEntryRepository) {
        this.journalEntryRepository = journalEntryRepository;
    }

    private final String UPLOAD_DIR = "uploads/journals/acts/";

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createJournalEntry(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("data") String entryDataJson
    ) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            JournalEntryDto entryDto = mapper.readValue(entryDataJson, JournalEntryDto.class);

            //  Обработка файла (если есть)
            String fileUrl = null;
            if (file != null && !file.isEmpty()) {
                // Создаем директорию, если не существует
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                // Генерируем уникальное имя файла
                String originalFilename = file.getOriginalFilename();
                assert originalFilename != null;
                String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                String uniqueFileName = UUID.randomUUID() + fileExtension;

                // Сохраняем файл
                Path filePath = uploadPath.resolve(uniqueFileName);
                Files.copy(file.getInputStream(), filePath);

                fileUrl = "/" + UPLOAD_DIR + uniqueFileName;
            }

            // 4. Сохранение в БД
            JournalEntry entry = convertToEntity(entryDto);
            entry.setActLink(fileUrl);
            JournalEntry savedEntry = journalEntryRepository.save(entry);

            // 5. Возвращаем результат
            JournalEntryResponse response = convertToResponse(savedEntry);
            return ResponseEntity.ok(response);

        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().body("Неверный формат данных");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка при обработке файла");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Внутренняя ошибка сервера");
        }
    }

}