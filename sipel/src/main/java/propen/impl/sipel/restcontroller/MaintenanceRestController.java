package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import propen.impl.sipel.model.MaintenanceModel;
import propen.impl.sipel.service.MaintenanceRestService;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/v1")
public class MaintenanceRestController {

    @Autowired
    MaintenanceRestService maintenanceRestService;

    // Mengembalikan list seluruh maintenance
    @GetMapping(value="/maintenances")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<MaintenanceModel> retrieveListMaintenance(){
        return maintenanceRestService.retrieveListMaintenance();
    }
}
