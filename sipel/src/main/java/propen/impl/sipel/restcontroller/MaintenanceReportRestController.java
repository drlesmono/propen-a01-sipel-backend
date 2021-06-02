package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.MaintenanceReportModel;
import propen.impl.sipel.model.ReportModel;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.MaintenanceReportDto;
import propen.impl.sipel.service.MaintenanceReportRestService;
import propen.impl.sipel.service.ReportRestService;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/v1")
public class MaintenanceReportRestController {

    @Autowired
    MaintenanceReportRestService maintenanceReportRestService;

    @Autowired
    ReportRestService reportRestService;

    // Mengembalikan list seluruh maintenance report
    @GetMapping(value="/reports/mr")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('ENGINEER')")
    public List<MaintenanceReportModel> retrieveListMr(){ return maintenanceReportRestService.retrieveListMr(); }

    // Membuat maintenance report setelah object report dibuat
    // Mengembalikan response dengan result maintenance report yang berhasil dibuat
    @PostMapping(value="/report/{idReport}/maintenance/upload")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('ENGINEER')")
    public BaseResponse<MaintenanceReportModel> uploadMaintenanceReport(@Valid @RequestBody MaintenanceReportDto mr,
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
}
