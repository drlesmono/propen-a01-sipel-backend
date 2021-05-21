package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.InstallationReportModel;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.InstallationReportDto;
import propen.impl.sipel.service.InstallationReportRestService;

import javax.validation.Valid;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class InstallationReportRestController {

    @Autowired
    InstallationReportRestService installationReportRestService;

    @PutMapping(value="/report/{idReport}/installation/{idInstallationReport}/update")
    private BaseResponse<InstallationReportModel> updateInstallationReport(@Valid @RequestBody InstallationReportDto ir,
                                                                            BindingResult bindingResult){
        BaseResponse<InstallationReportModel> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("Installation Report gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        InstallationReportModel newIr = installationReportRestService.updateIr(ir);

        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(newIr);

        return response;
    }
}
