package auth.chat.real.store.journals;

import auth.chat.real.store.entity.AbstractBaseEntity;
import auth.chat.real.store.project.Project;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "author_supervision_journal")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthorSupervisionJournal extends AbstractBaseEntity {
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project")
    private Project project;
    //todo может ли быть несколько журналов авторского надзора для одного проекта ?

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;
}