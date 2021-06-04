package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.model.TaskModel;
import propen.impl.sipel.service.OrderRestService;
import propen.impl.sipel.service.ProjectInstallationRestService;

import javax.validation.Valid;
import java.util.List;
import java.util.NoSuchElementException;

import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.ProjectInstallationDto;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/v1")
public class ProjectInstallationRestController {
    @Autowired
    private ProjectInstallationRestService projectInstallationRestService;

    @Autowired
    private OrderRestService orderRestService;

    @PostMapping(value = "/order/tambah/PI/{idOrder}")
    private ProjectInstallationModel createOrderPI(
            @Valid
            @RequestBody ProjectInstallationModel projectInstallation,
            @PathVariable ("idOrder") Long idOrder,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request body has invalid type or missing field"
            );
        }
        else {
            projectInstallation.setIdOrder(orderRestService.getOrderById(idOrder));
            return projectInstallationRestService.createOrderPI(projectInstallation);
        }
    }

    @GetMapping(value = "/order/detail/PI/{idOrderPi}")
    private ProjectInstallationModel retrieveOrderPI(
            @PathVariable(value = "idOrderPi") Long idOrderPi
    ) {
        try {
            return projectInstallationRestService.getPIOrderById(idOrderPi);
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Order with ID " + String.valueOf(idOrderPi) + " not found!"
            );
        }
    }

    @PutMapping(value = "/order/ubah/PI/{idOrderPi}")
    private ProjectInstallationModel updateOrderPI(
            @PathVariable(value = "idOrderPi") Long idOrderPi,
            @RequestBody ProjectInstallationModel projectInstallation
    ) {
        try {
            return projectInstallationRestService.changeOrderPI(idOrderPi, projectInstallation);
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Order with ID " + String.valueOf(idOrderPi) + " not found!"
            );
        }
    }

    // Mengembalikan list seluruh order jenis project installation
    @GetMapping(value="/orders/pi")
    @PreAuthorize("hasRole('ADMIN')")
    private List<ProjectInstallationModel> retrieveListPi(){
        return projectInstallationRestService.retrieveListPi();
    }

    // Mengubah pic engineer dari suatu project installation
    // Mengembalikan response dengan result project installation yang berhasil menyimpan pic engineer
    @PutMapping(value="/order/{idOrder}/pi/{idOrderPi}/updatePIC")
    @PreAuthorize("hasRole('ADMIN')")
    private BaseResponse<ProjectInstallationModel> updatePIC(@Valid @RequestBody ProjectInstallationDto pi,
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

    @GetMapping(value="/delivery-progress")
    @PreAuthorize("hasRole('ENGINEER')")
    public List<ProjectInstallationModel> getAllVerifiedPi(){
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
    @PreAuthorize("hasRole('ENGINEER')")
    public List<TaskModel> getListTaskByIdPi(@PathVariable Long idOrderPi, Model model){
        return projectInstallationRestService.getProjectInstallationByIdOrderPi(idOrderPi).getListTask();
    }
}
