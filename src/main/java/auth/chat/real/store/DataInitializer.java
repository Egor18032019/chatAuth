package auth.chat.real.store;

import auth.chat.real.store.journals.JournalEntry;
import auth.chat.real.store.journals.JournalEntryRepository;
import auth.chat.real.store.project.Project;
import auth.chat.real.store.project.repository.ProjectRepository;
import auth.chat.real.store.users.User;
import auth.chat.real.store.users.repository.UserRepository;
import auth.chat.real.utils.RoleType;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProjectRepository projectRepository;
    private final JournalEntryRepository journalEntryRepository;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder, ProjectRepository projectRepository, JournalEntryRepository journalEntryRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.projectRepository = projectRepository;
        this.journalEntryRepository = journalEntryRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        if (userRepository.count() == 0) {

            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@admin.com");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole(RoleType.ROLE_ADMIN);

            User user = new User();
            user.setUsername("user");
            user.setEmail("user@user.com");
            user.setPassword(passwordEncoder.encode("user"));
            user.setRole(RoleType.ROLE_USER);

            User manager = new User();
            manager.setUsername("manager");
            manager.setEmail("manager@manager.com");
            manager.setPassword(passwordEncoder.encode("manager"));
            manager.setRole(RoleType.ROLE_MANAGER);

            userRepository.saveAll(List.of(admin, user, manager));

            projectRepository.save(new Project("1", LocalDateTime.now(), admin));
            Project first = new Project("first", LocalDateTime.now(), admin);
            first.getUsers().add(manager);
            first.getUsers().add(user);
            projectRepository.save(first);
            projectRepository.save(new Project("Москва", LocalDateTime.now(), admin));

//todo имя проекта используется для запроса поэтому поменять на id проекта
//            projectRepository.save(new Project("2", LocalDateTime.now(), user));
//            Project second = new Project("second", LocalDateTime.now(), user);
//            projectRepository.save(second);
//            projectRepository.save(new Project("Тула", LocalDateTime.now(), user));


            projectRepository.save(new Project("3", LocalDateTime.now(), manager));
            Project third = new Project("third", LocalDateTime.now(), manager);
            third.getUsers().add(user);
            projectRepository.save(third);
            projectRepository.save(new Project("Екатеринбург", LocalDateTime.now(), manager));

            journalEntryRepository.save(new JournalEntry(
                    "01.09.2024",
                    "Проволока 1.5-ОЧ",
                    "200кв",
                    "ООО Альфа",
                    "Сертификат качества № 123456",
                    "Соответствует",
                    "Не требуется",
                    "Не требуется",
                    "Петров",
                    "https://example.com/act123.pdf",
                    first));
//            journalEntryRepository.save(new JournalEntry(
//                    "01.09.2024",
//                    "Проволока 1.5-ОЧ",
//                    "200кв",
//                    "ООО Бета",
//                    "Сертификат качества № 123456",
//                    "Соответствует",
//                    "Не требуется",
//                    "Не требуется",
//                    "Иванов",
//                    "https://example.com/act123.pdf",
//                    second));
            journalEntryRepository.save(new JournalEntry(
                    "01.09.2024",
                    "Проволока 1.5-ОЧ",
                    "200кв",
                    "ООО Третьяковка",
                    "Сертификат качества № 123456",
                    "Соответствует",
                    "Не требуется",
                    "Не требуется",
                    "Сидоров",
                    "https://example.com/act123.pdf",
                    third));
            System.out.println("Created default users: admin, user, manager");
        }
    }
}