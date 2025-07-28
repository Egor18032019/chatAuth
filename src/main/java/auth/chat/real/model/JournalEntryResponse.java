package auth.chat.real.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public   class JournalEntryResponse {
    private Long id;
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

/*
   id: 1,
            deliveryDate: '01.09.2024',
            materialName: 'Проволока 1.5-ОЧ',
            quantity: '200кв',
            supplier: 'ООО "Альфа"',
            document: 'Сертификат качества № 123456',
            inspectionResult: 'Соответствует',
            labControlDecision: 'Не требуется',
            labControlResult: 'Не требуется',
            inspector: 'Иелюев',
            actLink: 'https://example.com/act123.pdf'
 */