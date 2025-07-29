package auth.chat.real.store.location;

import auth.chat.real.store.entity.AbstractBaseEntity;
import auth.chat.real.store.project.Project;
import auth.chat.real.store.users.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "location")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Location extends AbstractBaseEntity {
    @Column(name = "latitude", nullable = false)
    private double latitude;
    @Column(name = "longitude", nullable = false)
    private double longitude;
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    // Внешний ключ на пользователя-создателя
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "username")   // колонка в таблице project
    private User user;
    // Руководитель организации 1 и начальник участка(главный инженер) 1
    // а прорабов уже несколько штук 5
    // то есть таблицы на начальника и руководителя надо сделать
    // (один руководитель и много проектов)
    // (один начальник -> один проект)
    // и таблицы на прорабов тоже (один прораб один проект)
    // Внешний ключ на пользователя-создателя
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project")   // колонка в таблице project
    private Project project;
}
