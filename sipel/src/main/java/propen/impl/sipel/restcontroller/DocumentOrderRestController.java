package propen.impl.sipel.restcontroller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.logging.Logger;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1")
public class DocumentOrderRestController {
    private static final Logger logger = Logger.getLogger(DocumentOrderRestController.class.getName());

    @PostMapping(value = "/order/{idOrder}/upload")
    public ResponseEntity<String> uploadDocument(
            @PathVariable("idOrder") Long idOrder,
            @RequestParam("file") MultipartFile multipartFile
    ) {

    }
}
