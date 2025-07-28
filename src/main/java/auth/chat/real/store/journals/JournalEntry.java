package auth.chat.real.store.journals;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "journal_entries")
@Getter
@Setter
public class JournalEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "delivery_date")
    private String deliveryDate;

    @Column(name = "material_name")
    private String materialName;

    private String quantity;
    private String supplier;
    private String document;

    @Column(name = "inspection_result")
    private String inspectionResult;

    @Column(name = "lab_control_decision")
    private String labControlDecision;

    @Column(name = "lab_control_result")
    private String labControlResult;

    private String inspector;

    @Column(name = "act_link")
    private String actLink;

    @Column(name = "chat_id")
    private String chatId;
}