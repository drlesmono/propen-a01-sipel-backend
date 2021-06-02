package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
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
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.logging.Logger;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
//@RequestMapping("")
public class ReportRestController {

    @Autowired
    ReportRestService reportRestService;

    @Autowired
    FileStorageService fileStorageService;

    private static final Logger logger = Logger.getLogger(ReportRestController.class.getName());

    // Mengembalikan list report yang berjenis installation dan maintenance
    @GetMapping(value="/api/v1/reportsIrMr")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('ENGINEER')")
    public List<ReportModel> retrieveListReportIrMr(){
        List<ReportModel> listReport = reportRestService.retrieveListReport();

        List<ReportModel> listReportFiltered = new ArrayList<>();
        for(ReportModel report : listReport){
            if(report.getReportType().equals("installation") || report.getReportType().equals("maintenance")){
                System.out.println(report.getReportName());
                listReportFiltered.add(report);
            }
        }

        return listReport;
    }

    // Menyimpan file yang diupload ke local server dan membuat report baru
    // File yang memiliki nama yang sama akan dibuat nama dengan versi
    // Mengembalikan response dengan result report yang berhasil dibuat
    @PostMapping(value="/api/v1/report/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('ENGINEER')")
    public BaseResponse<ReportModel> uploadReport(@Valid @ModelAttribute ReportDto report) throws Exception{
        BaseResponse<ReportModel> response = new BaseResponse<>();
        if(report.getReportType() == null && report.getFile() == null){
            // Respon Gagal Simpan
            response.setMessage("Laporan gagal disimpan." );
            response.setStatus(405);
            return response;
        }

        String fileNameOriginal = StringUtils.cleanPath(report.getFile().getOriginalFilename());
        ReportModel reportTarget = reportRestService.findReportByReportName(fileNameOriginal);
        if(reportTarget != null){
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
        String fileName = fileStorageService.storeFile(report.getFile(), fileNameOriginal);
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

    // Download file report yang dipilih
    @GetMapping("/report/{fileName:.+}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('ENGINEER')")
    public ResponseEntity<Resource> downloadReport(@PathVariable String fileName,
                                                  HttpServletRequest request){
        Resource resource = fileStorageService.loadFileAsResource(fileName);
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
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    // Menampilkan preview dari file yang dipilih dan berjenis pdf tanpa men-download
    @GetMapping("/report/{fileName:.+}/preview")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('ENGINEER')")
    public ResponseEntity<InputStreamResource> previewReport(@PathVariable String fileName) throws FileNotFoundException {
        Path filePath = fileStorageService.getFilePath(fileName);
        File file = new File(""+filePath+"");
        HttpHeaders headers = new HttpHeaders();
        headers.add("content-disposition", "inline;filename=" +fileName);

        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(file.length())
                .contentType(MediaType.parseMediaType("application/pdf"))
                .body(resource);
    }

    // Menghapus file dari local server dan report dari database
    @DeleteMapping(value="/api/v1/report/{idReport}/delete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('ENGINEER')")
    public ResponseEntity<String> deleteReport(@PathVariable("idReport") Long idReport) {
        try{
            ReportModel report = reportRestService.findReportById(idReport);
            String fileName = report.getReportName();
            Path filePath = fileStorageService.getFilePath(fileName);
            reportRestService.deleteReport(idReport);
            Files.delete(filePath);
            return ResponseEntity.ok("Report dengan ID "+String.valueOf(idReport)+" berhasil dihapus!");
        }catch (NoSuchElementException | IOException e){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Report dengan ID "+String.valueOf(idReport)+" tidak ditemukan!"
            );
        }
    }

    @PutMapping(value = "/api/v1/report/update/{idReport}")
    private ReportModel updateStatusReport(
            @PathVariable (value = "idReport") Long idReport,
            @RequestBody ReportModel report
    ) {
        try {
            return reportRestService.updateStatus(idReport, report);
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Report with ID " + String.valueOf(idReport) + " not found!"
            );
        }
    }
    @GetMapping(value="/api/v1/reports")
    private List<ReportModel> retrieveListReport(){
        List<ReportModel> listReport = reportRestService.retrieveListReport();
        List<ReportModel> toBeSeenReport = new ArrayList<>();
        for(ReportModel report : listReport){
            if(report.getStatusApproval().toLowerCase().equals("approved")){
                toBeSeenReport.add(report);
            }

        }

        return toBeSeenReport;
    }
    @GetMapping(value="/api/v1/reports/all")
    private List<ReportModel> retrieveListReportAll(){
        List<ReportModel> listReport = reportRestService.retrieveListReport();

        return listReport;
    }


}
