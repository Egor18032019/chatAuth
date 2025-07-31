package auth.chat.real.utils;

import auth.chat.real.model.JournalEntryResponse;
import auth.chat.real.model.ProjectPersonDto;
import auth.chat.real.store.journals.JournalEntry;
import auth.chat.real.store.users.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

public class UtilsFunctions {

    public static User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (User) auth.getPrincipal();
    }

    public static ProjectPersonDto convertToProjectPersonDto(List<User> users) {
        ProjectPersonDto projectPersonDto = new ProjectPersonDto();
        projectPersonDto.setUsers(users);
        return projectPersonDto;
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
        response.setProjectName(entry.getProject().getName());
        return response;
    }
}
