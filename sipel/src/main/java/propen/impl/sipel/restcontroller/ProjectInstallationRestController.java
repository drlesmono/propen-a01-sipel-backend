package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.ProjectInstallationDto;
import propen.impl.sipel.service.ProjectInstallationRestService;

import javax.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1")
public class ProjectInstallationRestController {

    @Autowired
    private ProjectInstallationRestService projectInstallationRestService;

    @PutMapping(value="/order/{idOrder}/pi/{idOrderPi}/updatePIC")
    private BaseResponse<ProjectInstallationDto> updatePIC(@Valid @RequestBody ProjectInstallationDto pi,
                                                             BindingResult bindingResult){
        BaseResponse<ProjectInstallationDto> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("PIC Engineer pada Project Installation gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(pi);
        projectInstallationRestService.updatePIC(pi.getIdOrderPi(), pi.getIdUserEng());
        return response;
    }
}
