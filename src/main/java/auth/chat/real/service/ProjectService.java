package auth.chat.real.service;

import auth.chat.real.store.project.Project;
import auth.chat.real.store.project.repository.ProjectRepository;
import auth.chat.real.store.users.User;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Tag(name = "Project Service", description = "Все операции, связанные с Project,\n" +
        "такие как получение всех проектов пользователя и создание и удаление проектов.")
public class ProjectService {

    private ProjectRepository projectRepository;

//    public void createProject(Long userId, String projectName) {
//        if (userId != null && projectName != null) {
//            if (projectRepository.existsByNameAndId(projectName, userId)) {
//                // Проект с таким именем уже существует;
//                System.out.println("Project with name " + projectName + " already exists.");
//                //todo вернуть ошибку
//            } else {
//                // Создание нового проекта
//                projectRepository.save(new Project(projectName));// Проект успешно создан
//            }
//        }
//    }

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

    public List<Project> getAllProjectsOwner(Long userId) {
        return projectRepository.findAllByOwnerId(userId);
    }
    public List<Project> getAllProjectsUser(Long userId) {
        return projectRepository.findAllByOwnerId(userId);
    }
    public List<User> findPeopleByProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Проект не найден"));
        return project.getUsers(); // участники
    }
    public List<Project> getProjectsWhereUserIsParticipant(Long userId) {
        return projectRepository.findByUsers_Id(userId);
    }
}
