package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.service.ManagedServicesRestService;
import propen.impl.sipel.service.OrderRestService;

import javax.validation.Valid;
import java.util.List;
import java.util.NoSuchElementException;

import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.ManagedServicesDto;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedHashMap;

import org.springframework.security.access.prepost.PreAuthorize;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
public class ManagedServicesRestController {

    @Autowired
    private ManagedServicesRestService managedServicesRestService;

    @Autowired
    private OrderRestService orderRestService;

    @PostMapping(value = "/order/tambah/MS/{idOrder}")
    @PreAuthorize("hasRole('ADMIN')")
    public ManagedServicesModel createOrderMS(
            @Valid
            @RequestBody ManagedServicesModel managedServices,
            @PathVariable ("idOrder") Long idOrder,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request body has invalid type or missing field"
            );
        }
        else {
            managedServices.setIdOrder(orderRestService.getOrderById(idOrder));
            return managedServicesRestService.createOrderMS(managedServices);
        }
    }

    @GetMapping(value = "/order/detail/MS/{idOrderMs}")
    @PreAuthorize("hasRole('ADMIN')")
    public ManagedServicesModel retrieveOrderMS(
            @PathVariable(value = "idOrderMs") Long idOrderMs
    ) {
        try {
            return managedServicesRestService.getMSOrderById(idOrderMs);
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Order with ID " + String.valueOf(idOrderMs) + " not found!"
            );
        }
    }

    @PutMapping(value = "/order/ubah/MS/{idOrderMs}")
    @PreAuthorize("hasRole('ADMIN')")
    public ManagedServicesModel updateOrderMS(
            @PathVariable(value = "idOrderMs") Long idOrderMs,
            @RequestBody ManagedServicesModel managedServices
    ) {
        try {
            return managedServicesRestService.changeOrderMS(idOrderMs, managedServices);
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Order with ID " + String.valueOf(idOrderMs) + " not found!"
            );
        }
    }

    @GetMapping(value = "/orderMSassigned")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ManagedServicesModel> retrieveMSTerassigned() {
        return managedServicesRestService.retrieveMSassigned();
    }

    // Mengembalikan list seluruh order jenis managed services
    @GetMapping(value="/orders/ms")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENGINEER')")
    public List<ManagedServicesModel> retrieveListMs(){
        return managedServicesRestService.retrieveListMs();
    }

    // Mengubah pic engineer dari suatu managed services
    // Mengembalikan response dengan result managed services yang berhasil menyimpan pic engineer
    @PutMapping(value="/order/{idOrder}/ms/{idOrderMs}/updatePIC")
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
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
    public LinkedHashMap<String, String> retrieveTermMs(){

        return managedServicesRestService.retrievePercentageMs();
    }
}
