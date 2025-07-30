package auth.chat.real.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class AuthorSupervisionJournalDTO {
    private String projectName;
    private LocalDate startDate;
    private LocalDate endDate;

}