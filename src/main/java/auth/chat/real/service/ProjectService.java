package auth.chat.real.service;

import auth.chat.real.store.project.Project;
import auth.chat.real.store.project.repository.ProjectRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Tag(name = "Project Service", description = "Все операции, связанные с Project,\n" +
        "такие как получение всех проектов пользователя и создание и удаление проектов.")
public class ProjectService {

    private ProjectRepository projectRepository;

    public void createProject(Long userId, String projectName) {
        if (userId != null && projectName != null) {
            if (projectRepository.existsByNameAndId(projectName, userId)) {
                // Проект с таким именем уже существует;
                System.out.println("Project with name " + projectName + " already exists.");
                //todo вернуть ошибку
            } else {
                // Создание нового проекта
                projectRepository.save(new Project(projectName));// Проект успешно создан
            }
        }

    }

    public void deleteProject(Long userId, String projectName) {
        if (userId != null && projectName != null) {
            // Удаление проекта
            if (projectRepository.existsByNameAndId(projectName, userId)) {
                projectRepository.deleteByNameAndId(projectName, userId);
            } else {
                // Проект с таким именем не существует
                System.out.println("Project with name " + projectName + " does not exist.");
                //todo вернуть ошибку
            }
        }
    }

    public List<Project> getAllProjects(Long userId) {
        return projectRepository.findAllByOwnerId(userId);
    }
}
