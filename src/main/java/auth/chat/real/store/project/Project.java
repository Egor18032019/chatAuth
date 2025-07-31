package auth.chat.real.store.project;

import auth.chat.real.store.entity.AbstractBaseEntity;
import auth.chat.real.store.users.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project",
        indexes = {
                @Index(name = "idx_project_name", columnList = "name"),
                @Index(name = "idx_project_owner", columnList = "user_id")
        })
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"owner", "users"})
public class Project extends AbstractBaseEntity {

    @Column(name = "name", unique = true, nullable = false, length = 100)
    private String name;

    @CreationTimestamp
    @Column(name = "create_date", updatable = false)
    private LocalDateTime createDate;

    @Column(name = "close_date")
    private LocalDateTime closeDate;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_project_owner"))
    private User owner;


    @ManyToMany(cascade = {CascadeType.MERGE})
    @JoinTable(
            name = "project_users",
            joinColumns = @JoinColumn(name = "project_id",
                    foreignKey = @ForeignKey(name = "fk_project_users_project")),
            inverseJoinColumns = @JoinColumn(name = "user_id",
                    foreignKey = @ForeignKey(name = "fk_project_users_user"))
    )
    private List<User> users = new ArrayList<>();

    // Бизнес-методы
    public boolean isActive() {
        return closeDate == null || closeDate.isAfter(LocalDateTime.now());
    }


    public Project(String name, LocalDateTime createDate, User owner) {
        this.name = name;
        this.createDate = createDate;
        this.owner = owner;
        users = new ArrayList<>();
    }

    @PreUpdate
    protected void onUpdate() {
        if (closeDate != null && closeDate.isBefore(createDate)) {
            throw new IllegalStateException("Close date cannot be before create date");
        }
    }
}