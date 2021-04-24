package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import propen.impl.sipel.model.ServicesModel;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.ManagedServicesDto;
import propen.impl.sipel.rest.ServicesDto;
import propen.impl.sipel.service.ServicesRestService;

import javax.validation.Valid;
import java.util.NoSuchElementException;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1")
public class ServicesRestController {

    @Autowired
    private ServicesRestService servicesRestService;

    @PutMapping(value="/order/{idOrder}/ms/{idOrderMs}/service/{idService}/updateEngineer")
    private BaseResponse<ServicesDto> updateEngineer(@Valid @RequestBody ServicesDto service,
                                                     BindingResult bindingResult){
        BaseResponse<ServicesDto> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("Engineer pada service gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(service);
        servicesRestService.updateEngineer(service.getIdService(), service.getIdUser());
        return response;
    }

}
