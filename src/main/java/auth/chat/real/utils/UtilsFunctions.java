package auth.chat.real.utils;

import auth.chat.real.model.JournalEntryDto;
import auth.chat.real.model.JournalEntryResponse;
import auth.chat.real.store.journals.JournalEntry;
import auth.chat.real.store.users.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class UtilsFunctions {

    public static User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (User) auth.getPrincipal();
    }

    public static JournalEntry convertToEntity(JournalEntryDto dto) {
        JournalEntry entry = new JournalEntry();
        entry.setDeliveryDate(dto.getDeliveryDate());
        entry.setMaterialName(dto.getMaterialName());
        entry.setQuantity(dto.getQuantity());
        entry.setSupplier(dto.getSupplier());
        entry.setDocument(dto.getDocument());
        entry.setInspectionResult(dto.getInspectionResult());
        entry.setLabControlDecision(dto.getLabControlDecision());
        entry.setLabControlResult(dto.getLabControlResult());
        entry.setInspector(dto.getInspector());
        entry.setActLink(dto.getActLink());
        entry.setChatId(dto.getChatId());
        return entry;
    }

    public static JournalEntryResponse convertToResponse(JournalEntry entry) {
        JournalEntryResponse response = new JournalEntryResponse();
        response.setId(entry.getId());
        response.setDeliveryDate(entry.getDeliveryDate());
        response.setMaterialName(entry.getMaterialName());
        response.setQuantity(entry.getQuantity());
        response.setSupplier(entry.getSupplier());
        response.setDocument(entry.getDocument());
        response.setInspectionResult(entry.getInspectionResult());
        response.setLabControlDecision(entry.getLabControlDecision());
        response.setLabControlResult(entry.getLabControlResult());
        response.setInspector(entry.getInspector());
        response.setActLink(entry.getActLink());
        response.setChatId(entry.getChatId());
        return response;
    }
}
