package auth.chat.real.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthorSupervisionJournalResponseDTO {
    private Long id;
    private String projectName;
    private LocalDate startDate;
    private LocalDate endDate;

}
