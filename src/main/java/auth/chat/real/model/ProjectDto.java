package auth.chat.real.model;

import auth.chat.real.store.project.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDto {
    private Long id;
    private String name;
    private LocalDateTime createDate;
    private LocalDateTime closeDate;

    // статический конвертер
    public static ProjectDto fromEntity(Project entity) {
        return ProjectDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .createDate(entity.getCreateDate())
                .closeDate(entity.getCloseDate() != null ? entity.getCloseDate() : null) //todo подумать как лучше
                .build();
    }
}
