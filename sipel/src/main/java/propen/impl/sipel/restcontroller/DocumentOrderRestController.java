package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import propen.impl.sipel.model.DocumentOrderModel;
import propen.impl.sipel.repository.DocumentOrderDb;
import propen.impl.sipel.service.OrderRestService;

import java.io.InputStream;
import java.util.Date;
import java.util.logging.Logger;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1")
public class DocumentOrderRestController {
    @Autowired
    private OrderRestService orderRestService;

    @Autowired
    DocumentOrderDb documentOrderDb;

    private static final Logger logger = Logger.getLogger(DocumentOrderRestController.class.getName());

    @PostMapping(value = "/order/{idOrder}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadDocument(
            @PathVariable("idOrder") Long idOrder,
            @RequestParam("document") MultipartFile file,
            @RequestBody DocumentOrderModel document,
            BindingResult bindingResult
    ) throws Exception {
        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request body has invalid type or missing field"
            );
        }
        InputStream inputStream = file.getInputStream();
        String fileName = file.getOriginalFilename();
        document.setIdOrder(orderRestService.getOrderById(idOrder));
        document.setDocName(fileName);
        document.setSize(file.getSize());
        document.setUploadedDate(new Date());
        documentOrderDb.save(document);

        return new ResponseEntity<String>(fileName, HttpStatus.OK);
    }
}
