package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.ManagedServicesDto;
import propen.impl.sipel.service.ManagedServicesRestService;

import javax.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1")
public class ManagedServicesRestController {

    @Autowired
    private ManagedServicesRestService managedServicesRestService;

    @PutMapping(value="/order/{idOrder}/ms/{idOrderMs}/updatePIC")
    private BaseResponse<ManagedServicesModel> updatePIC(@Valid @RequestBody ManagedServicesDto ms,
                                                         BindingResult bindingResult){
        BaseResponse<ManagedServicesModel> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("PIC Engineer pada Managed Service gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        ManagedServicesModel newMs = managedServicesRestService.updatePIC(ms.getIdOrderMs(), ms.getIdUserPic());
        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(newMs);

        return response;
    }
}
