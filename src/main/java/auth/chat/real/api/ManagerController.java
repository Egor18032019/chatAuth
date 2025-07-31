package auth.chat.real.api;


import auth.chat.real.model.ProjectDto;
import auth.chat.real.service.ProjectService;
import auth.chat.real.utils.EndPoint;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static auth.chat.real.utils.UtilsFunctions.getCurrentUser;

@RestController
@PreAuthorize("hasRole('MANAGER')")
@RequestMapping(EndPoint.MANAGER)
@Tag(name = "Для менеджеров")
public class ManagerController {
    private final ProjectService projectService;

    public ManagerController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    @Operation(summary = "Доступен только авторизованным пользователям с ролью MANAGER")
    public ResponseEntity<String> user() {
        return ResponseEntity.ok("MANAGER");
    }


    @GetMapping(EndPoint.PROJECT)
    public List<ProjectDto> getProjects() {
        return projectService.getAllProjectsOwner(getCurrentUser().getId())
                .stream()
                .map(ProjectDto::fromEntity)
                .toList();
    }
}
