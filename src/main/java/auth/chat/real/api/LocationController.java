package auth.chat.real.api;

import auth.chat.real.model.LocationDTO;
import auth.chat.real.store.location.Location;
import auth.chat.real.store.location.LocationForUserRepository;
import auth.chat.real.store.project.Project;
import auth.chat.real.store.project.repository.ProjectRepository;
import auth.chat.real.utils.EndPoint;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

import static auth.chat.real.utils.UtilsFunctions.getCurrentUser;

@RestController
@RequestMapping(EndPoint.API)
@Tag(name = "Location Controller", description = "Контроллер для записи местоположения")
public class LocationController {
    LocationForUserRepository locationForUserRepository;
    ProjectRepository projectRepository;

    public LocationController(LocationForUserRepository locationForUserRepository, ProjectRepository projectRepository) {
        this.locationForUserRepository = locationForUserRepository;
        this.projectRepository = projectRepository;
    }

    @PostMapping(EndPoint.LOCATION)
    @Operation(summary = "Сохранить местоположение пользователя", description = "Принимает DTO с координатами и сохраняет их в БД")
    public ResponseEntity<Void> location(@RequestBody LocationDTO locationDTO) {
        try {
            Location location = new Location();
            location.setLatitude(locationDTO.getLatitude());
            location.setLongitude(locationDTO.getLongitude());
            location.setTimestamp(locationDTO.getTimestamp() == null ? LocalDateTime.now() : locationDTO.getTimestamp());
            location.setUser(getCurrentUser());
            location.setProject(getProject(locationDTO.getProject()));
            locationForUserRepository.save(location);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            //todo ошибки нет пользователя отдельно
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/location/{project}")
    @Operation(summary = "Получить последнее местоположение пользователя", description = "Возвращает последнее сохраненное местоположение пользователя")
    public ResponseEntity<Location> getLastLocationUser(@PathVariable String project) {
        Location location = locationForUserRepository.findFirstByUser_usernameAndProject_NameOrderByTimestampDesc(getCurrentUser().getUsername(), project);
        return ResponseEntity.ok(location);
    }

    @GetMapping("/location/all")
    @Operation(summary = "Получить все местоположения пользователя в этом проекте.", description = "Возвращает все местоположение пользователя на проекте")
    public ResponseEntity<List<Location>> getAllLocationForUser(@PathVariable String project) {

        List<Location> location = locationForUserRepository.findAllByUser_usernameAndProject_Name(getCurrentUser().getUsername(), project);
        return ResponseEntity.ok(location);

    }

    private Project getProject(String name) {

        Project project = projectRepository.findByName(name);
        if (project == null) {
            System.out.println("Project not found");//todo кастомные сделать
        }
        return project;
    }
}
