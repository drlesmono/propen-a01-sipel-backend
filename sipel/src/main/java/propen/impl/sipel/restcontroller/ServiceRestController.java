package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.model.ServicesModel;
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

    @PostMapping(value = "/order/tambah/Services")
    private List<ServicesModel> createServices(
            @Valid
            @RequestBody ServicesModel services,
            ManagedServicesModel managedServices,
            HttpServletRequest request,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request body has invalid type or missing field"
            );
        }
        else {
            String[] serviceName = request.getParameterValues("name");
            return servicesRestService.createServices(serviceName, services, managedServices);
        }
    }

    @GetMapping(value = "/order/detail/Service{idService}")
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

    @PutMapping(value = "/order/ubah/{idService}")
    private List<ServicesModel> updateService(
            @PathVariable(value = "idOrder") Long idService,
            @RequestBody ServicesModel services,
            HttpServletRequest request,
            ManagedServicesModel managedServices
    ) {
        try {
            String[] serviceName = request.getParameterValues("name");
            return servicesRestService.changeServices(serviceName, managedServices);
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Order with ID " + String.valueOf(idService) + " not found!"
            );
        }
    }
}
