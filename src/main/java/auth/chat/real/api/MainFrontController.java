package auth.chat.real.api;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

// MainFrontController.java

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@Controller
@RequiredArgsConstructor
public class MainFrontController {

    private static final Logger log = LoggerFactory.getLogger(MainFrontController.class);

    @RequestMapping({"/", "/index.html", "/app/**", "/react/**", "/chat/**"})
    public ResponseEntity<byte[]> serveIndex() throws IOException {
        var resource = new ClassPathResource("static/index.html");

        if (resource.exists()) {
            byte[] bytes = resource.getInputStream().readAllBytes();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_HTML_VALUE)
                    .body(bytes);
        } else {
            return ResponseEntity.status(500).body("index.html not found!".getBytes());
        }
    }
}