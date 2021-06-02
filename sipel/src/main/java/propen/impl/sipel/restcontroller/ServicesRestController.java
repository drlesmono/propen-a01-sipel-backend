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
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class ServicesRestController {

    @Autowired
    private ServicesRestService servicesRestService;

    // Mengubah data dari service
    // Mengembalikan response dengan result service yang berhasil diubah
    @PutMapping(value="/order/{idOrder}/ms/{idOrderMs}/service/{idService}/updateService")
    private BaseResponse<ServicesModel> updateService(@Valid @RequestBody ServicesDto service,
                                                     BindingResult bindingResult){
        BaseResponse<ServicesModel> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("Service gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        ServicesModel newService = servicesRestService.updateService(service);

        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(newService);

        return response;
    }

    // Membuat service baru
    // Mengembalikan response dengan result service yang berhasil dibuat
    @PostMapping(value="/order/{idOrder}/ms/{idOrderMs}/createService")
    private BaseResponse<ServicesModel> createService(@Valid @RequestBody ServicesDto service,
                                                    @PathVariable("idOrderMs") Long idOrderMs,
                                                     BindingResult bindingResult){
        BaseResponse<ServicesModel> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("Service gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        ServicesModel newService = servicesRestService.createService(service, idOrderMs);

        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(newService);

        return response;
    }
}
