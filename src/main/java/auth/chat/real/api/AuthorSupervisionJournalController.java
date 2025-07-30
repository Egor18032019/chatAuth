package auth.chat.real.api;

import auth.chat.real.model.AuthorSupervisionJournalDTO;
import auth.chat.real.model.AuthorSupervisionJournalResponseDTO;
import auth.chat.real.store.journals.AuthorSupervisionJournal;
import auth.chat.real.store.journals.AuthorSupervisionJournalRepository;
import auth.chat.real.store.project.repository.ProjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/author-supervision-journal")
public class AuthorSupervisionJournalController {
    private final AuthorSupervisionJournalRepository journalRepository;
    private final ProjectRepository projectRepository;

    public AuthorSupervisionJournalController(AuthorSupervisionJournalRepository journalRepository, ProjectRepository projectRepository) {
        this.journalRepository = journalRepository;
        this.projectRepository = projectRepository;
    }

    @PostMapping
    public ResponseEntity<?> saveJournal(@RequestBody AuthorSupervisionJournalDTO dto) {
        try {
            if (dto.getProjectName() == null || dto.getProjectName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(errorResponse("projectName обязательное поле"));
            }
            if (dto.getStartDate() == null) {
                return ResponseEntity.badRequest()
                        .body(errorResponse("startDate обязательное поле"));
            }
            if (projectRepository.existsByName(dto.getProjectName())) {
                // Ищем существующую запись по имени проекта(уточнить связи)
                Optional<AuthorSupervisionJournal> journal = journalRepository
                        .findAllByProject_Name(dto.getProjectName());

                if (journal.isPresent()) {
                    return ResponseEntity.ok(Map.of(
                            "success", true,
                            "message", "Данные успешно сохранены",
                            "data", journal
                    ));
                } else {
                    AuthorSupervisionJournal newJournal = new AuthorSupervisionJournal();
                    newJournal.setProject(projectRepository.findByName(dto.getProjectName()));
                    newJournal.setStartDate(dto.getStartDate());
                    newJournal.setEndDate(dto.getEndDate());
                    journalRepository.save(newJournal);
                    return ResponseEntity.ok(Map.of(
                            "success", true,
                            "message", "Данные успешно сохранены",
                            "data", journal
                    ));
                }
            } else {
                return ResponseEntity.badRequest()
                        .body(errorResponse("projectName не правильно указан"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse("Ошибка при сохранении: " + e.getMessage()));
        }


    }

    /**
     * Получение журнала по projectName
     */
    @GetMapping("/{projectName}")
    public ResponseEntity<?> getJournal(@PathVariable String projectName) {
        try {
            if (projectName == null || projectName.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(errorResponse("Параметр projectName обязателен"));
            }

            Optional<AuthorSupervisionJournal> journal = journalRepository.findAllByProject_Name(projectName);

            if (journal.isPresent()) {
                AuthorSupervisionJournalResponseDTO journalData = new AuthorSupervisionJournalResponseDTO();
                journalData.setId(journal.get().getId());
                journalData.setProjectName(journal.get().getProject().getName());
                journalData.setStartDate(journal.get().getStartDate());
                journalData.setEndDate(journal.get().getEndDate());
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "data", journalData
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                        "success", false,
                        "data", new AuthorSupervisionJournalResponseDTO(),
                        "message", "Журнал не найден"
                ));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse("Ошибка при загрузке: " + e.getMessage()));
        }
    }

    // Вспомогательная функция для ошибок
    private Map<String, Object> errorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", message);
        return error;
    }
}
