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
import propen.impl.sipel.service.OrderRestService;
import propen.impl.sipel.service.ProjectInstallationRestService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1")
public class ProjectInstallationRestController {
    @Autowired
    private ProjectInstallationRestService projectInstallationRestService;

    @Autowired
    private OrderRestService orderRestService;

    @PostMapping(value = "/order/tambah/PI/{idOrder}")
    private ProjectInstallationModel createOrderPI(
            @Valid
            @RequestBody ProjectInstallationModel projectInstallation,
            @PathVariable ("idOrder") Long idOrder,
            HttpServletRequest request,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request body has invalid type or missing field"
            );
        }
        else {
            //OrderModel order = orderRestService.getOrderById(idOrder);
            projectInstallation.setIdOrder(orderRestService.getOrderById(idOrder));
            return projectInstallationRestService.createOrderPI(projectInstallation);
        }
    }

    @GetMapping(value = "/order/detail/PI/{idOrderPi}")
    private ProjectInstallationModel retrieveOrderPI(
            @PathVariable(value = "idOrderPi") Long idOrderPi
    ) {
        try {
            return projectInstallationRestService.getPIOrderById(idOrderPi);
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Order with ID " + String.valueOf(idOrderPi) + " not found!"
            );
        }
    }

    @PutMapping(value = "/order/ubah/PI/{idOrderPi}")
    private ProjectInstallationModel updateOrderPI(
            @PathVariable(value = "idOrderPi") Long idOrderPi,
            @RequestBody ProjectInstallationModel projectInstallation
    ) {
        try {
            return projectInstallationRestService.changeOrderPI(idOrderPi, projectInstallation);
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Order with ID " + String.valueOf(idOrderPi) + " not found!"
            );
        }
    }

    @GetMapping(value = "/orderPI")
    private List<ProjectInstallationModel> retrievePI() {
        return projectInstallationRestService.retrievePI();
    }
}
