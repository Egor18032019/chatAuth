package auth.chat.real.store.location;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationForUserRepository extends JpaRepository<Location, String> {
    Location findFirstByUsernameOrderByTimestampDesc(String username);

    List<Location> findAllByUsername(String username);
}
