package auth.chat.real.api;

import auth.chat.real.model.LocationDTO;
import auth.chat.real.store.location.Location;
import auth.chat.real.store.location.LocationForUserRepository;
import auth.chat.real.utils.EndPoint;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(EndPoint.API)
@Tag(name = "Location Controller", description = "Контроллер для записи местоположения")
public class LocationController {
    LocationForUserRepository locationForUserRepository;

    public LocationController(LocationForUserRepository locationForUserRepository) {
        this.locationForUserRepository = locationForUserRepository;
    }

    @PostMapping("/location")
    @Operation(summary = "Сохранить местоположение пользователя", description = "Принимает DTO с координатами и сохраняет их в БД")
    public ResponseEntity<Void> location(@RequestBody LocationDTO locationDTO) {
        try {
            Location location = new Location();
            location.setLatitude(locationDTO.getLatitude());
            location.setLongitude(locationDTO.getLongitude());
            location.setUsername(getCurrentUsername());
            locationForUserRepository.save(location);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            //todo ошибки нет пользователя отдельно
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/location/{username}")
    @Operation(summary = "Получить последнее местоположение пользователя", description = "Возвращает последнее сохраненное местоположение пользователя")
    public ResponseEntity<Location> getLastLocationUser(@PathVariable String username) {

        if (username.equals(getCurrentUsername())) {
            Location location = locationForUserRepository.findFirstByUsernameOrderByTimestampDesc(username);
            return ResponseEntity.ok(location);
        } else {
            return ResponseEntity.badRequest().body(null);
        }

    }

    @GetMapping("/location/all")
    @Operation(summary = "Получить последнее местоположение пользователя", description = "Возвращает последнее сохраненное местоположение пользователя")
    public ResponseEntity<List<Location>> getAllLocationForUser(@PathVariable String username) {
        if (username.equals(getCurrentUsername())) {
            List<Location> location = locationForUserRepository.findAllByUsername(username);
            return ResponseEntity.ok(location);
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    //todo вынести ?
    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }
}
