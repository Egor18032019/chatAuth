package auth.chat.real.store.project.repository;


import auth.chat.real.store.project.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.access.method.P;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByOwnerId(Long id);

    Project findByName(String name);

    void deleteByNameAndId(String name, Long id);

    Boolean existsByNameAndId(String name, Long id);
}
