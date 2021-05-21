package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;
import propen.impl.sipel.model.MaintenanceModel;
import propen.impl.sipel.service.MaintenanceRestService;
import propen.impl.sipel.service.ManagedServicesRestService;

import javax.validation.Valid;

public class MaintenanceRestController {
    @Autowired
    private MaintenanceRestService maintenanceRestService;

    @Autowired
    private ManagedServicesRestService managedServicesRestService;

    @PostMapping(value = "/produksi/maintenance/tambah/{idOrderMS}")
    private MaintenanceModel createMaintenanceSchedule(
            @Valid
            @RequestBody MaintenanceModel maintenance,
            @PathVariable ("idOrderMS") Long idOrderMS,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request body has invalid type or missing field"
            );
        }
        else {
            maintenance.setIdOrderMS(managedServicesRestService.getMSOrderById(idOrderMS));
            return maintenanceRestService.createMaintenance(maintenance);
        }
    }
}
