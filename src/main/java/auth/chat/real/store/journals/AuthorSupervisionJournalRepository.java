package auth.chat.real.store.journals;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AuthorSupervisionJournalRepository extends JpaRepository<AuthorSupervisionJournal, Long> {
    Optional<AuthorSupervisionJournal> findAllByProject_Name(String projectName);
}
