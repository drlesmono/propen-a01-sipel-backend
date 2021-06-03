package propen.impl.sipel.restcontroller;

import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import propen.impl.sipel.filestorage.FileStorageService;
import propen.impl.sipel.model.ReportModel;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.ReportDto;
import propen.impl.sipel.service.ReportRestService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.logging.Logger;

@RestController
@CrossOrigin(origins = "*")
public class ReportRestController {

    @Autowired
    ReportRestService reportRestService;

    @Autowired
    FileStorageService fileStorageService;

    // Mengembalikan list report yang berjenis installation dan maintenance
    @GetMapping(value="/api/v1/reportsIrMr")
    private List<ReportModel> retrieveListReportIrMr(){
        List<ReportModel> listReport = reportRestService.retrieveListReport();

        List<ReportModel> listReportFiltered = new ArrayList<>();
        for(ReportModel report : listReport){
            if(report.getReportType().equals("installation") || report.getReportType().equals("maintenance")){
                System.out.println(report.getReportName());
                listReportFiltered.add(report);
            }
        }

        return listReportFiltered;
    }

    // Menyimpan file yang diupload ke local server dan membuat report baru
    // File yang memiliki nama yang sama akan dibuat nama dengan versi
    // Mengembalikan response dengan result report yang berhasil dibuat
    @PostMapping(value="/api/v1/report/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    private BaseResponse<ReportModel> uploadReport(@Valid @ModelAttribute ReportDto report,
                                                   HttpServletRequest request) throws Exception{
        BaseResponse<ReportModel> response = new BaseResponse<>();
        if(report.getReportType() == null && report.getFile() == null){
            // Respon Gagal Simpan
            response.setMessage("Laporan gagal disimpan." );
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
        File file = fileStorageService.storeFile(uploadRootDir, fileNameOriginal, report.getFile());
        String urlFile = file.getAbsolutePath();
        report.setReportName(fileNameOriginal);
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
    public ResponseEntity<Resource> downloadReport(@PathVariable String fileName) throws IOException {

        ReportModel reportTarget = reportRestService.findReportByReportName(fileName);

        File file = new File(reportTarget.getUrlFile());

        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(file.length())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    // Menampilkan preview dari file yang dipilih dan berjenis pdf tanpa men-download
    @GetMapping("/report/{fileName:.+}/preview")
    public ResponseEntity<InputStreamResource> previewReport(@PathVariable String fileName) throws FileNotFoundException {
        ReportModel report = reportRestService.findReportByReportName(fileName);
        File file = new File(report.getUrlFile());
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
    private ResponseEntity<String> deleteReport(@PathVariable("idReport") Long idReport) {
        try{
            ReportModel report = reportRestService.findReportById(idReport);
            String fileName = report.getReportName();
//            Path filePath = fileStorageService.getFilePath(fileName);
            File file = new File(report.getUrlFile());
            if(file.delete()){
                reportRestService.deleteReport(idReport);
                return ResponseEntity.ok("Report dengan ID "+String.valueOf(idReport)+" berhasil dihapus!");
            }else{
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Report dengan ID "+String.valueOf(idReport)+" tidak ditemukan!"
                );
            }
        }catch (NoSuchElementException e){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Report dengan ID "+String.valueOf(idReport)+" tidak ditemukan!"
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
