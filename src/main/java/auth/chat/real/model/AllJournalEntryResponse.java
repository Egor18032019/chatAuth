package auth.chat.real.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
public class AllJournalEntryResponse {
    List<JournalEntryResponse> journalEntries;
}
