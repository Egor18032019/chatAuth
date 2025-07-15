package auth.chat.real.service;

import auth.chat.real.store.chat.ChatRoom;
import auth.chat.real.store.chat.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ChatRoomService {

    @Autowired private ChatRoomRepository chatRoomRepository;

}
