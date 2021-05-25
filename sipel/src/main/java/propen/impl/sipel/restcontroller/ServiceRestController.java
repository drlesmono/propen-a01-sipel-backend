package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.model.ServicesModel;
import propen.impl.sipel.service.ManagedServicesRestService;
import propen.impl.sipel.service.ServicesRestService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1")
public class ServiceRestController {
    @Autowired
    private ServicesRestService servicesRestService;

    @Autowired
    private ManagedServicesRestService managedServicesRestService;

    @PostMapping(value = "/order/tambah/MS/{idOrderMs}/Service")
    private ServicesModel createServices(
            @Valid
            @RequestBody ServicesModel services,
            @PathVariable ("idOrderMs") Long idOrderMs,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request body has invalid type or missing field"
            );
        }
        else {
            ManagedServicesModel managedServices = managedServicesRestService.getMSOrderById(idOrderMs);
            return servicesRestService.createServices(services, managedServices);
        }
    }

    @GetMapping(value = "/order/detail/Service/{idService}")
    private ServicesModel retrieveService(
            @PathVariable(value = "idService") Long idService
    ) {
        try {
            return servicesRestService.getServiceById(idService);
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Order with ID " + String.valueOf(idService) + " not found!"
            );
        }
    }

    @GetMapping(value = "/order/detail/MS/Services")
    private List<ServicesModel> getServices(
            ManagedServicesModel managedServices
    ) {
        return managedServices.getListService();
    }

    @PutMapping(value = "/order/ubah/service/{idService}")
    private ServicesModel updateService(
            @PathVariable(value = "idService") Long idService,
            @RequestBody ServicesModel services
    ) {
        try {
            return servicesRestService.changeServices(idService, services);
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Service with ID " + String.valueOf(idService) + " not found!"
            );
        }
    }

    @GetMapping(value = "/order/MS/{idOrderMS}/listService")
    private List<ServicesModel> retrieveListService(
            @Valid
            @PathVariable (value = "idOrderMS") Long idOrderMS
    ) {
        return servicesRestService.getListService(idOrderMS);
    }

    @DeleteMapping(value = "order/delete/service/{idService}")
    private ResponseEntity<String> deleteService(
            @Valid
            @PathVariable(value = "idService") Long idService
    ) {
        try {
            servicesRestService.deleteService(idService);
            return ResponseEntity.ok("Service dengan ID " + String.valueOf(idService) + " berhasil dihapus!");
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Service dengan ID " + String.valueOf(idService) + " tidak ditemukan!"
            );
        }
        catch (UnsupportedOperationException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Service masih terassign engineer, tolong hapus engineer terlebih dahulu"
            );
        }
    }
}
