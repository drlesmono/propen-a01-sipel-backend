package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import propen.impl.sipel.model.MaintenanceReportModel;
import propen.impl.sipel.model.ReportModel;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.MaintenanceReportDto;
import propen.impl.sipel.service.MaintenanceReportRestService;
import propen.impl.sipel.service.ReportRestService;

import javax.validation.Valid;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class MaintenanceReportRestController {

    @Autowired
    MaintenanceReportRestService maintenanceReportRestService;

    @Autowired
    ReportRestService reportRestService;

    @GetMapping(value="/reports/mr")
    private List<MaintenanceReportModel> retrieveListMr(){ return maintenanceReportRestService.retrieveListMr(); }

    @PostMapping(value="/report/{idReport}/maintenance/upload")
    private BaseResponse<MaintenanceReportModel> uploadMaintenanceReport(@Valid @RequestBody MaintenanceReportDto mr,
                                                                         @PathVariable("idReport") Long idReport,
                                                                         BindingResult bindingResult){
        BaseResponse<MaintenanceReportModel> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("Maintenance Report gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        ReportModel report = reportRestService.findReportById(idReport);
        MaintenanceReportModel newMr = maintenanceReportRestService.uploadMr(report, mr);

        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(newMr);

        return response;
    }

    @PutMapping(value = "/update/mr/notes/{idMaintenanceReport}")
    private MaintenanceReportModel updateNotesMrReport(
            @PathVariable(value = "idMaintenanceReport") Long idMaintenanceReport,
            @RequestBody MaintenanceReportModel maintenanceReport
            ) {
        try {
            return maintenanceReportRestService.updateNotes(idMaintenanceReport, maintenanceReport);
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Report with ID " + String.valueOf(idMaintenanceReport) + " not found!"
            );
        }
    }
}
