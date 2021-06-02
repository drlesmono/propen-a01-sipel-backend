package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.ProjectInstallationDto;
import propen.impl.sipel.service.ProjectInstallationRestService;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/v1")
public class ProjectInstallationRestController {

    @Autowired
    private ProjectInstallationRestService projectInstallationRestService;

    // Mengembalikan list seluruh order jenis project installation
    @GetMapping(value="/orders/pi")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<ProjectInstallationModel> retrieveListPi(){
        return projectInstallationRestService.retrieveListPi();
    }

    // Mengubah pic engineer dari suatu project installation
    // Mengembalikan response dengan result project installation yang berhasil menyimpan pic engineer
    @PutMapping(value="/order/{idOrder}/pi/{idOrderPi}/updatePIC")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public BaseResponse<ProjectInstallationModel> updatePIC(@Valid @RequestBody ProjectInstallationDto pi,
                                                             BindingResult bindingResult){
        BaseResponse<ProjectInstallationModel> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("PIC Engineer pada Project Installation gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        ProjectInstallationModel newPi = projectInstallationRestService.updatePIC(pi.getIdOrderPi(), pi.getIdUserEng());
        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(newPi);

        return response;
    }

    @PutMapping(value="/order/{idOrder}/pi/{idOrderPi}/updateStatus")
    private BaseResponse<ProjectInstallationDto> updateStatus(@Valid @RequestBody ProjectInstallationDto pi,
                                                           BindingResult bindingResult){
        BaseResponse<ProjectInstallationDto> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("Status pada Project Installation gagal diubah." );
            response.setStatus(405);
            return response;
        }
        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(pi);
        projectInstallationRestService.updateStatus(pi.getIdOrderPi(), pi.getStatus());
        return response;
    }
}
