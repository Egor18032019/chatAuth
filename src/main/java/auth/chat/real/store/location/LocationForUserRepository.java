package auth.chat.real.store.location;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationForUserRepository extends JpaRepository<Location, Long> {

    Location findFirstByUser_usernameAndProject_NameOrderByTimestampDesc(String username, String project);

    List<Location> findAllByUser_usernameAndProject_Name(String username, String project);
}
