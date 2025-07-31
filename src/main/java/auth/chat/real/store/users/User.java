package auth.chat.real.store.users;

import auth.chat.real.store.entity.AbstractBaseEntity;
import auth.chat.real.utils.RoleType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User extends AbstractBaseEntity implements UserDetails {

    @Column(name = "username", unique = true, nullable = false)
    private String username;
    @Column(unique = true, length = 100, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    //todo время создание и изменения добавить createdAt updatedAt
    @Column(nullable = false)
    private RoleType role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorityList = new ArrayList<>();

            authorityList.add(new SimpleGrantedAuthority(role.name()));

        return authorityList;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
