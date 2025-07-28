package auth.chat.real.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class JournalEntryDto {
    private String deliveryDate;
    private String materialName;
    private String quantity;
    private String supplier;
    private String document;
    private String inspectionResult;
    private String labControlDecision;
    private String labControlResult;
    private String inspector;
    private String actLink;
    private String chatId;
}