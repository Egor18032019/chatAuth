package auth.chat.real.api;

import auth.chat.real.model.ProjectDto;
import auth.chat.real.model.ProjectPersonDto;
import auth.chat.real.service.ProjectService;
import auth.chat.real.utils.EndPoint;
import auth.chat.real.utils.RoleType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static auth.chat.real.utils.UtilsFunctions.convertToProjectPersonDto;
import static auth.chat.real.utils.UtilsFunctions.getCurrentUser;

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
        if (getCurrentUser().getRole().equals(RoleType.ROLE_MANAGER)) {
            return projectService.getAllProjectsOwner(getCurrentUser().getId())
                    .stream()
                    .map(ProjectDto::fromEntity)
                    .toList();
        }

        if (getCurrentUser().getRole().equals(RoleType.ROLE_USER)) {
            return projectService.getProjectsWhereUserIsParticipant(getCurrentUser().getId())
                    .stream()
                    .map(ProjectDto::fromEntity)
                    .toList();
        }
        if (getCurrentUser().getRole().equals(RoleType.ROLE_ADMIN)) {
            if (getCurrentUser().getRole().equals(RoleType.ROLE_ADMIN)) {
                return projectService.getAllProjectsOwner(getCurrentUser().getId())
                        .stream()
                        .map(ProjectDto::fromEntity)
                        .toList();
            }
        }
        return null;//todo обдумать
    }

    @GetMapping("/{projectId}/people")
    @Operation(summary = "Участники проекта")
    public ProjectPersonDto getProjectPeople(@PathVariable Long projectId) {

        return convertToProjectPersonDto(projectService.findPeopleByProject(projectId));
    }

}
