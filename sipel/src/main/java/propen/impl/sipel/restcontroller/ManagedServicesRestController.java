package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.ManagedServicesDto;
import propen.impl.sipel.service.ManagedServicesRestService;

import javax.validation.Valid;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1")
public class ManagedServicesRestController {

    @Autowired
    private ManagedServicesRestService managedServicesRestService;

    @PutMapping(value="/order/{idOrder}/ms/{idOrderMs}/updatePIC")
    private BaseResponse<ManagedServicesDto> updatePIC(@Valid @RequestBody ManagedServicesDto ms,
                                                       BindingResult bindingResult){
        BaseResponse<ManagedServicesDto> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("PIC Engineer pada Managed Service gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(ms);
        managedServicesRestService.updatePIC(ms.getIdOrderMs(), ms.getIdUserPic());
        return response;
    }

    @PutMapping(value="/order/{idOrder}/ms/{idOrderMs}/updateKontrak")
    private BaseResponse<ManagedServicesDto> updateKontrak(@Valid @RequestBody ManagedServicesDto ms,
                                                       BindingResult bindingResult){
        BaseResponse<ManagedServicesDto> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("PIC Engineer pada Managed Service gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(ms);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date actualStart = formatter.parse(ms.getActualStart());
            Date actualEnd = formatter.parse(ms.getActualEnd());
            managedServicesRestService.updateKontrak(ms.getIdOrderMs(), actualStart, actualEnd);
            System.out.println(formatter.format(actualStart));
            System.out.println(formatter.format(actualEnd));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return response;
    }
}
