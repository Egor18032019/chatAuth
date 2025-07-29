package auth.chat.real.store.journals;

import auth.chat.real.store.entity.AbstractBaseEntity;
import auth.chat.real.store.project.Project;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "journal_entries")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JournalEntry extends AbstractBaseEntity {

    @Column(name = "delivery_date")
    private String deliveryDate; //todo LocalDate

    @Column(name = "material_name")
    private String materialName;

    private String quantity;
    private String supplier;
    private String document;

    @Column(name = "inspection_result")
    private String inspectionResult;//todo enum

    @Column(name = "lab_control_decision")
    private String labControlDecision;

    @Column(name = "lab_control_result")
    private String labControlResult;

    private String inspector;

    @Column(name = "act_link")
    private String actLink;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project")   // колонка в таблице project
    private Project project;

}