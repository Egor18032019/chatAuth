package auth.chat.real.store;

import auth.chat.real.store.project.Project;
import auth.chat.real.store.project.repository.ProjectRepository;
import auth.chat.real.store.users.User;
import auth.chat.real.store.users.repository.UserRepository;
import auth.chat.real.utils.RoleType;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProjectRepository projectRepository;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder, ProjectRepository projectRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.projectRepository = projectRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        if (userRepository.count() == 0) {

            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@admin.com");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.getRoles().add(RoleType.ROLE_ADMIN);

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

            projectRepository.save(new Project("first", LocalDateTime.now(), admin));
            projectRepository.save(new Project("second", LocalDateTime.now(), user));
            projectRepository.save(new Project("three", LocalDateTime.now(), manager));

            projectRepository.save(new Project("1", LocalDateTime.now(), admin));
            projectRepository.save(new Project("2", LocalDateTime.now(), user));
            projectRepository.save(new Project("3", LocalDateTime.now(), manager));


            projectRepository.save(new Project("Москва", LocalDateTime.now(), admin));
            projectRepository.save(new Project("Тула", LocalDateTime.now(), user));
            projectRepository.save(new Project("Екатеринбург", LocalDateTime.now(), manager));

            System.out.println("Created default users: admin, user, manager");
        }
    }
}