package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.InstallationReportModel;
import propen.impl.sipel.model.ReportModel;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.InstallationReportDto;
import propen.impl.sipel.service.InstallationReportRestService;
import propen.impl.sipel.service.ReportRestService;

import javax.validation.Valid;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.security.access.prepost.PreAuthorize;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
public class InstallationReportRestController {

    @Autowired
    InstallationReportRestService installationReportRestService;

    @Autowired
    ReportRestService reportRestService;

    // Mengembalikan list seluruh installation report
    @GetMapping(value="/reports/ir")
    @PreAuthorize("hasRole('ENGINEER') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('FINANCE')")
    public List<InstallationReportModel> retrieveListIr(){ return installationReportRestService.retrieveListIr(); }

    // Membuat installation report setelah object report dibuat
    // Mengembalikan response dengan result installation report yang berhasil dibuat
    @PostMapping(value="/report/{idReport}/installation/upload")
    @PreAuthorize("hasRole('ENGINEER')")
    public BaseResponse<InstallationReportModel> uploadInstallationReport(@Valid @RequestBody InstallationReportDto ir,
                                                                            @PathVariable("idReport") Long idReport,
                                                                            BindingResult bindingResult){
        BaseResponse<InstallationReportModel> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("Installation Report gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        ReportModel report = reportRestService.findReportById(idReport);
        InstallationReportModel newIr = installationReportRestService.uploadIr(report, ir);

        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(newIr);

        return response;
    }

    @PutMapping(value = "/update/notes/{idInstallationReport}")
    @PreAuthorize("hasRole('MANAGER')")
    public InstallationReportModel updateNotesReport(
            @PathVariable(value = "idInstallationReport") Long idInstallationReport,
            @RequestBody InstallationReportModel installationReport
    ) {
        try {
            return installationReportRestService.updateNotes(idInstallationReport, installationReport);
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Report with ID " + String.valueOf(idInstallationReport) + " not found!"
            );
        }
    }
}
