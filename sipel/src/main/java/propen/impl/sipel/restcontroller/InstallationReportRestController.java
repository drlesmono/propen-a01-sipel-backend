package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
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

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class InstallationReportRestController {

    @Autowired
    InstallationReportRestService installationReportRestService;

    @Autowired
    ReportRestService reportRestService;

    @GetMapping(value="/reports/ir")
    private List<InstallationReportModel> retrieveListIr(){ return installationReportRestService.retrieveListIr(); }

    @PostMapping(value="/report/{idReport}/installation/upload")
    private BaseResponse<InstallationReportModel> uploadInstallationReport(@Valid @RequestBody InstallationReportDto ir,
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
}
