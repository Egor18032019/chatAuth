package auth.chat.real.model;

import auth.chat.real.store.users.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ProjectPersonDto {
    List<User> users;
}
