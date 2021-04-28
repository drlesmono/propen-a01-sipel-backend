package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.MaintenanceDto;
import propen.impl.sipel.rest.ManagedServicesDto;
import propen.impl.sipel.rest.ServicesDto;
import propen.impl.sipel.service.MaintenanceRestService;
import propen.impl.sipel.service.ManagedServicesRestService;

import javax.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1")
public class MaintenanceRestController {

    @Autowired
    private MaintenanceRestService maintenanceRestService;

    @PutMapping(value="/order/{idOrder}/ms/{idOrderMs}/maintenance/{idMaintenance}/updateStatus")
    private BaseResponse<MaintenanceDto> updateStatus(@Valid @RequestBody MaintenanceDto maintenance,
                                                     BindingResult bindingResult){
        BaseResponse<MaintenanceDto> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("Perubahan status maintenance gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(maintenance);
        maintenanceRestService.updateStatus(maintenance.getIdMaintenance(), maintenance.getMaintained());
        return response;
    }


}
