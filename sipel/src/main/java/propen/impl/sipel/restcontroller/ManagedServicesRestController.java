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
import propen.impl.sipel.service.ManagedServicesRestService;
import propen.impl.sipel.service.OrderRestService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1")
public class ManagedServicesRestController {
    @Autowired
    private ManagedServicesRestService managedServicesRestService;

    @Autowired
    private OrderRestService orderRestService;

    @PostMapping(value = "/order/tambah/MS/{idOrder}")
    private ManagedServicesModel createOrderMS(
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
    private ManagedServicesModel retrieveOrderMS(
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

    @PutMapping(value = "/order/ubah/MS/{idOrder}")
    private ManagedServicesModel updateOrderMS(
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

    @GetMapping(value = "/orderMS")
    public List<ManagedServicesModel> retrieveMS() {
        return managedServicesRestService.retrieveMS();
    }
}
