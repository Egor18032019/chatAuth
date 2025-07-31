package auth.chat.real.store.project.repository;


import auth.chat.real.store.project.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.method.P;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByOwnerId(Long id);

    Project findByName(String name);

    void deleteByNameAndId(String name, Long id);

    Boolean existsByName(String name);

    Boolean existsByNameAndId(String name, Long id);

    List<Project> findByUsers_Id(Long userId);

    @Query("SELECT p FROM Project p JOIN p.users u WHERE u.id = :userId")
    List<Project> findAllByUserParticipant(@Param("userId") Long userId);
}
