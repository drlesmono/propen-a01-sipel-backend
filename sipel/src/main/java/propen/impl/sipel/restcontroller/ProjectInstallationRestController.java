package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.model.TaskModel;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.ProjectInstallationDto;
import propen.impl.sipel.service.ProjectInstallationRestService;

import javax.validation.Valid;
import java.util.List;

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

    @GetMapping(value="/delivery-progress")
    private List<ProjectInstallationModel> getAllVerifiedPi(){
        List<ProjectInstallationModel> listVerifiedPi = projectInstallationRestService.getListVerifiedPi();

        for (ProjectInstallationModel pi : listVerifiedPi) {
            pi.setOrderName(pi.getIdOrder().getOrderName());
            List<TaskModel> listTask = pi.getListTask();
            if (listTask!=null){
                for (TaskModel task : listTask){
                    pi.setPercentage(pi.getPercentage()+(task.getPercentage()/listTask.size()));
                }
            }
        }
        return listVerifiedPi;
    }

    @GetMapping(value="/list-task/{idOrderPi}")
    private List<TaskModel> getListTaskByIdPi(@PathVariable Long idOrderPi, Model model){
        return projectInstallationRestService.getProjectInstallationByIdOrderPi(idOrderPi).getListTask();
    }

}
