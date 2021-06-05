package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import propen.impl.sipel.filestorage.FileStorageService;
import propen.impl.sipel.model.DocumentOrderModel;
import propen.impl.sipel.model.ReportModel;
import propen.impl.sipel.repository.DocumentOrderDb;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.DocumentOrderDto;
import propen.impl.sipel.rest.ReportDto;
import propen.impl.sipel.service.DocumentOrderRestService;
import propen.impl.sipel.service.OrderRestService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.logging.Logger;

import org.springframework.security.access.prepost.PreAuthorize;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class DocumentOrderRestController {
    @Autowired
    private DocumentOrderRestService documentOrderRestService;

    @Autowired
    FileStorageService fileStorageService;

    private static final Logger logger = Logger.getLogger(DocumentOrderRestController.class.getName());

    @GetMapping(value = "/api/v1/order/{idOrder}/documents")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    public List<DocumentOrderModel> retrieveDocOrderList(
            @Valid
            @PathVariable (value = "idOrder") Long idOrder
    ){
        return documentOrderRestService.retrieveListDocOrder(idOrder);
    }

    @PostMapping(value="/api/v1/order/{idOrder}/document/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    public BaseResponse<DocumentOrderModel> uploadDocumentOrder(
            @Valid
            @ModelAttribute DocumentOrderDto docOrder,
            @PathVariable(value = "idOrder") Long idOrder,
            HttpServletRequest request
    ) throws Exception{
        BaseResponse<DocumentOrderModel> response = new BaseResponse<>();
        if(docOrder.getFile() == null){
            // Respon Gagal Simpan
            response.setMessage("Dokumen Order gagal disimpan." );
            response.setStatus(405);
            return response;
        }

        // Root Directory
        String uploadRootPath = request.getServletContext().getRealPath("upload");

        File uploadRootDir = new File(uploadRootPath);
        // Create directory if it not exists.
        if (!uploadRootDir.exists()) {
            uploadRootDir.mkdirs();
        }

        String fileNameOriginal = StringUtils.cleanPath(docOrder.getFile().getOriginalFilename());
        DocumentOrderModel docTarget = documentOrderRestService.findDocumentByDocumentName(fileNameOriginal);
        if(docTarget != null){
            String[] listFileNameOriginal = StringUtils.split(fileNameOriginal, ".");
            if(listFileNameOriginal[0].contains("ver.")) {
                String[] listFileNameOriginalTarget = listFileNameOriginal[0].split("ver.");
                fileNameOriginal = listFileNameOriginalTarget[0] + " ver." +
                        (Integer.parseInt(listFileNameOriginalTarget[1]) + 1) +
                        "." + listFileNameOriginal[1];
            }else{
                fileNameOriginal = listFileNameOriginal[0] + " ver.2" + "." + listFileNameOriginal[1];
            }
        }
        File file = fileStorageService.storeFile(uploadRootDir, fileNameOriginal, docOrder.getFile());
        String urlFile = file.getAbsolutePath();
        docOrder.setDocName(fileNameOriginal);
        docOrder.setIdOrder(idOrder);
        docOrder.setFileType(docOrder.getFile().getContentType());
        docOrder.setSize(docOrder.getFile().getSize());
        DocumentOrderModel newDoc = documentOrderRestService.uploadDocument(docOrder, urlFile);
        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(newDoc);

        return response;
    }

    @GetMapping("/order/document/{fileName:.+}")
    public ResponseEntity<Resource> downloadDocumentOrder(@PathVariable String fileName) throws IOException {

        DocumentOrderModel document = documentOrderRestService.findDocumentByDocumentName(fileName);

        Resource resource = fileStorageService.loadFileAsResource(document.getUrlFile(), document.getDocName());

        String fileType = document.getFileType();

        if(fileType==null){
            fileType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.parseMediaType(fileType))
                .body(resource);
    }

    @GetMapping("/order/document/{fileName:.+}/preview")
    public ResponseEntity<InputStreamResource> previewDocumentOrder(@PathVariable String fileName) throws FileNotFoundException {
        DocumentOrderModel document = documentOrderRestService.findDocumentByDocumentName(fileName);
        File file = new File(document.getUrlFile());
        HttpHeaders headers = new HttpHeaders();
        headers.add("content-disposition", "inline;filename=" +fileName);

        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(file.length())
                .contentType(MediaType.parseMediaType("application/pdf"))
                .body(resource);
    }

    @DeleteMapping(value="/api/v1/order/document/{idDoc}/delete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    public ResponseEntity<String> deleteDocumentOrder(@PathVariable("idDoc") Long idDoc) {
        try{
            DocumentOrderModel document = documentOrderRestService.findDocumentById(idDoc);
            File file = new File(document.getUrlFile());
            if(file.delete()){
                documentOrderRestService.deleteDocument(idDoc);
                return ResponseEntity.ok("Dokumen dengan ID "+String.valueOf(idDoc)+" berhasil dihapus!");
            }else{
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Dokumen dengan ID "+String.valueOf(idDoc)+" tidak ditemukan!"
                );
            }
        }catch (NoSuchElementException e){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Dokumen Order dengan ID "+String.valueOf(idDoc)+" tidak ditemukan!"
            );
        }
    }
}
