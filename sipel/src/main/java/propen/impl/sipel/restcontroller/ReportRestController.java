package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import propen.impl.sipel.filestorage.FileStorageService;
import propen.impl.sipel.model.ReportModel;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.ReportDto;
import propen.impl.sipel.service.ReportRestService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.logging.Logger;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class ReportRestController {

    @Autowired
    ReportRestService reportRestService;

    @Autowired
    FileStorageService fileStorageService;

    private static final Logger logger = Logger.getLogger(ReportRestController.class.getName());

    @GetMapping(value="/reportsIrMr")
    private List<ReportModel> retrieveListReportIrMr(){
        List<ReportModel> listReport = reportRestService.retrieveListReport();

        List<ReportModel> listReportFiltered = new ArrayList<>();
        for(ReportModel report : listReport){
            if(report.getReportType().equals("installation") || report.getReportType().equals("maintenance")){
                listReportFiltered.add(report);
            }
        }

        return listReport;
    }

    @PostMapping(value="/report/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    private BaseResponse<ReportModel> uploadReport(@Valid @ModelAttribute ReportDto report) throws Exception{
        BaseResponse<ReportModel> response = new BaseResponse<>();
        if(report.getReportType() == null && report.getFile() == null){
            // Respon Gagal Simpan
            response.setMessage("Laporan gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        String fileName = fileStorageService.storeFile(report.getFile());
        String urlFile = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/report/")
                .path(fileName)
                .toUriString();
        report.setReportName(fileName);
        report.setFileType(report.getFile().getContentType());
        report.setSize(report.getFile().getSize());
        ReportModel newReport = reportRestService.uploadReport(report, urlFile);
        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(newReport);

        return response;
    }

    @GetMapping("/report/{idReport}")
    public ResponseEntity<Resource> previewReport(@PathVariable("idReport") Long idReport,
                                                  HttpServletRequest request){
        ReportModel report = reportRestService.findReportById(idReport);
        Resource resource = fileStorageService.loadFileAsResource(report.getReportName());
        String fileType = null;

        try{
            fileType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        }catch (IOException e){
            System.out.println("Tidak dapat menentukan tipe file");
        }

        if(fileType==null){
            fileType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(fileType))
                .body(resource);
    }

    @DeleteMapping(value="/report/{idReport}/delete")
    private ResponseEntity<String> deleteReport(@PathVariable("idReport") Long idReport) {
        try{
            reportRestService.deleteReport(idReport);
            return ResponseEntity.ok("Report dengan ID "+String.valueOf(idReport)+" berhasil dihapus!");
        }catch (NoSuchElementException e){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Report dengan ID "+String.valueOf(idReport)+" tidak ditemukan!"
            );
        }
    }
}
