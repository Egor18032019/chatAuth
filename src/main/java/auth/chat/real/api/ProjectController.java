package auth.chat.real.api;

import auth.chat.real.model.ProjectDto;
import auth.chat.real.service.ProjectService;
import auth.chat.real.store.users.User;
import auth.chat.real.utils.EndPoint;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import auth.chat.real.store.project.Project;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(EndPoint.API)
@Tag(name = "Project Controller", description = "Контроллер для проектов")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping(EndPoint.PROJECT)
    public List<ProjectDto> getProjects() {
        return projectService.getAllProjects(getCurrentUser().getId())
                .stream()
                .map(ProjectDto::fromEntity)
                .toList();
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (User) auth.getPrincipal();
    }
}
