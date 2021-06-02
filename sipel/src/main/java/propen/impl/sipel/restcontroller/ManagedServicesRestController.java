package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.ManagedServicesDto;
import propen.impl.sipel.service.ManagedServicesRestService;
import propen.impl.sipel.service.OrderRestService;

import javax.validation.Valid;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/v1")
public class ManagedServicesRestController {

    @Autowired
    private ManagedServicesRestService managedServicesRestService;

    @Autowired
    private OrderRestService orderRestService;

    // Mengembalikan list seluruh order jenis managed services
    @GetMapping(value="/orders/ms")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<ManagedServicesModel> retrieveListMs(){
        return managedServicesRestService.retrieveListMs();
    }

    // Mengubah pic engineer dari suatu managed services
    // Mengembalikan response dengan result managed services yang berhasil menyimpan pic engineer
    @PutMapping(value="/order/{idOrder}/ms/{idOrderMs}/updatePIC")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public BaseResponse<ManagedServicesModel> updatePIC(@Valid @RequestBody ManagedServicesDto ms,
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

    // Mengubah periode kontrak dari suatu managed services
    // Mengembalikan response dengan result managed services yang berhasil menyimpan periode kontrak
    @PutMapping(value="/order/{idOrder}/ms/updateKontrak")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public BaseResponse<ManagedServicesModel> updateKontrak(@Valid @RequestBody ManagedServicesDto ms,
                                                             @PathVariable("idOrder") Long idOrder,
                                                             BindingResult bindingResult){
        BaseResponse<ManagedServicesModel> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("Periode kontrak pada Managed Service gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        OrderModel order = orderRestService.findOrderById(idOrder);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date actualStart = formatter.parse(ms.getActualStart());
            Date actualEnd = formatter.parse(ms.getActualEnd());
            ManagedServicesModel newMs = managedServicesRestService.updateKontrak(order.getIdOrderMs().getIdOrderMs(),
                                        ms.getIdUserPic(), actualStart, actualEnd);
            response.setStatus(200);
            response.setMessage("Success");
            response.setResult(newMs);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return response;
    }

    @GetMapping(value="/orders/ms/perc")
    private LinkedHashMap<String, String> retrieveTermMs(){

        return managedServicesRestService.retrievePercentageMs();
    }
}
