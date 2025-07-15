package auth.chat.real.store;

import auth.chat.real.store.chat.ChatRoom;
import auth.chat.real.store.chat.repository.ChatRoomRepository;
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
    private final ChatRoomRepository chatRoomRepository;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder, ChatRoomRepository chatRoomRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.chatRoomRepository = chatRoomRepository;
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

            chatRoomRepository.save(new ChatRoom("firstRoom"));
            chatRoomRepository.save(new ChatRoom("secondRoom"));

            System.out.println("Created default users: admin, user, manager");
        }
    }
}