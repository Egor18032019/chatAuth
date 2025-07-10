package auth.chat.real.api;


import auth.chat.real.model.Info;
import auth.chat.real.utils.EndPoint;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(EndPoint.INFO)
@RequiredArgsConstructor
@Tag(name = "Общая информация")
public class ExampleController {
    @GetMapping
    @Operation(summary = "Доступно всем ролям.")
    public ResponseEntity<Info> example() {
        Info info = new Info("Hello world");
        return ResponseEntity.ok(info);
    }
}
