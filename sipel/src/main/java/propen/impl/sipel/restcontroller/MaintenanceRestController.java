package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import propen.impl.sipel.model.MaintenanceModel;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.service.MaintenanceRestService;
import propen.impl.sipel.service.ManagedServicesRestService;

import javax.validation.Valid;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import propen.impl.sipel.model.MaintenanceModel;
import propen.impl.sipel.service.MaintenanceRestService;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1")
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
            ManagedServicesModel ms = managedServicesRestService.getMSOrderById(idOrderMS);
            return maintenanceRestService.createMaintenance(maintenance, ms);
        }
    }

    @GetMapping(value = "/produksi/maintenance/daftar/{idOrderMS}")
    private List<MaintenanceModel> retrieveListMaintenance(
            @Valid
            @PathVariable ("idOrderMS") Long idOrderMS
    ) {
        return maintenanceRestService.retrieveMaintenanceMS(idOrderMS);
    }

    @GetMapping(value = "/maintenance/list")
    private List<MaintenanceModel> listMn() {
        return maintenanceRestService.retrieveMaintenance();
    }

    @PutMapping(value = "/produksi/maintenance/ubah/{idMaintenance}")
    private MaintenanceModel changeMaintenance(
            @PathVariable(value = "idMaintenance") Long idMaintenance,
            @RequestBody MaintenanceModel maintenance
    ) {
        try {
            return maintenanceRestService.changeMaintenance(idMaintenance, maintenance);
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Maintenance with ID " + String.valueOf(idMaintenance) + " not found!"
            );
        }
    }

    @GetMapping(value = "/produksi/maintenance/detail/{idMaintenance}")
    private MaintenanceModel detailMaintenance(
            @PathVariable(value = "idMaintenance") Long idMaintenance
    ) {
        try {
            return maintenanceRestService.getMaintenanceById(idMaintenance);
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Maintenance with ID " + String.valueOf(idMaintenance) + " not found!"
            );
        }
    }

    @DeleteMapping(value = "/produksi/maintenance/delete/{idMaintenance}")
    private ResponseEntity<String> deleteMaintenance(
            @Valid
            @PathVariable(value = "idMaintenance") Long idMaintenance
    ) {
        try {
            maintenanceRestService.deleteMaintenance(idMaintenance);
            return ResponseEntity.ok("Maintenance dengan ID " + String.valueOf(idMaintenance) + " berhasil dihapus!");
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Maintenance dengan ID " + String.valueOf(idMaintenance) + " tidak ditemukan!"
            );
        }
        catch (UnsupportedOperationException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Maintenance telah selesai dan tidak dapat dihapus!"
            );
        }
    }

    // Mengembalikan list seluruh maintenance
    @GetMapping(value="/maintenances")
    private List<MaintenanceModel> retrieveListMaintenance(){
        return maintenanceRestService.retrieveListMaintenance();
    }
}
