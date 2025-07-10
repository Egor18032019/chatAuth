package auth.chat.real.store;

import auth.chat.real.store.users.User;
import auth.chat.real.store.users.repository.UserRepository;
import auth.chat.real.utils.RoleType;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Проверяем, есть ли уже пользователи в БД
        if (userRepository.count() == 0) {
            // Создаем пользователей
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@admin.com");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.getRoles().add(RoleType.ROLE_ADMIN);
            ;

            User user = new User();
            user.setUsername("user");
            user.setEmail("user@user.com");
            user.setPassword(passwordEncoder.encode("user"));
            user.getRoles().add(RoleType.ROLE_USER);

            User manager = new User();
            manager.setUsername("manager");
            manager.setEmail("manager@manager.com");
            manager.setPassword(passwordEncoder.encode("manager"));
            manager.getRoles().add(RoleType.ROLE_MANAGER);

            userRepository.saveAll(List.of(admin, user, manager));

            System.out.println("Created default users: admin, user, manager");
        }
    }
}