package auth.chat.real.api;

import auth.chat.real.utils.EndPoint;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(EndPoint.ADMIN)
@Tag(name = "Енд поинт для администратора")
// Работа с пользователями. Добавление удаление изменения роли
public class AdminController {

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Доступен только авторизованным пользователям с ролью Admin")
    public ResponseEntity<String> admin() {
        return ResponseEntity.ok("Admin");
    }
}
