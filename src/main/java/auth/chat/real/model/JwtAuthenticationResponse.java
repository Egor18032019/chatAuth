package auth.chat.real.model;

import auth.chat.real.utils.RoleType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Ответ c токеном доступа и ролью пользователя")
public class JwtAuthenticationResponse {
    @Schema(description = "Токен доступа", example = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYyMjUwNj...")
    private String token;
    @Schema(description = "Роли пользователя в системе", example = "ROLE_USER, ROLE_ADMIN, ROLE_MANAGER")
    private RoleType  role;
}