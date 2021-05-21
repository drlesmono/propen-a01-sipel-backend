package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.InstallationReportModel;
import propen.impl.sipel.model.MaintenanceReportModel;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.InstallationReportDto;
import propen.impl.sipel.rest.MaintenanceReportDto;
import propen.impl.sipel.service.InstallationReportRestService;
import propen.impl.sipel.service.MaintenanceReportRestService;

import javax.validation.Valid;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class MaintenanceReportRestController {

    @Autowired
    MaintenanceReportRestService maintenanceReportRestService;

    @PutMapping(value="/report/{idReport}/maintenance/{idMaintenanceReport}/update")
    private BaseResponse<MaintenanceReportModel> updateMaintenanceReport(@Valid @RequestBody MaintenanceReportDto mr,
                                                                          BindingResult bindingResult){
        BaseResponse<MaintenanceReportModel> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("Maintenance Report gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        MaintenanceReportModel newMr = maintenanceReportRestService.updateMr(mr);

        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(newMr);

        return response;
    }
}
