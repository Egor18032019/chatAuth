package auth.chat.real.store.project;

import auth.chat.real.store.entity.AbstractBaseEntity;
import auth.chat.real.store.users.User;   // ← импорт
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "project")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Project extends AbstractBaseEntity {
    @Column(name = "name", unique = true, nullable = false)
    private String name;
    private LocalDateTime createDate;
    private LocalDateTime closeDate;

    // Внешний ключ на пользователя-создателя
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")   // колонка в таблице project
    private User owner;


    public Project(String name, LocalDateTime createDate, User owner) {
        this.name = name;
        this.createDate = createDate;
        this.owner = owner;
    }

    public Project(String name) {
        this.name = name;
        this.createDate = LocalDateTime.now();
    }
}