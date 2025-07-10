package auth.chat.real.configuration;

import auth.chat.real.model.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import static auth.chat.real.utils.EndPointWebSocket.TOPIC_GROUP;


@Component
public class WebSocketEventListener {
    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {

        var foo = event.getMessage().getHeaders();
        for (Object o : foo.keySet()) {
            if (o.equals("simpSessionId")) {
                System.out.println(foo.get(o));
            }
        }
        System.out.println("Received a new web socket connection.");
        System.out.println("Вошел в чат." + event.getMessage().getHeaders().get("sender"));
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        var atr = headerAccessor.getSessionAttributes();
        System.out.println("handleWebSocketDisconnectListener");
        System.out.println(atr.toString());
        String username = (String) atr.get("sender");
        String username1 = (String) atr.get("username");
        if (username != null) {
            System.out.println("User Disconnected : " + username);

            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setContent(username + " left the chat.");
//            chatMessage.setSenderName(username);
            chatMessage.setSender(username);

            messagingTemplate.convertAndSend(TOPIC_GROUP, chatMessage);
        }
    }
}