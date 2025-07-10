package auth.chat.real.store.entity;

import org.springframework.util.Assert;

public interface HasId {
    Long getId();

    void setId(Long id);

    default boolean isNew() {
        return getId() == null;
    }

    // doesn't work for hibernate lazy proxy
    default Long id() {
        Assert.notNull(getId(), "Entity must has id");
        return getId();
    }
}
