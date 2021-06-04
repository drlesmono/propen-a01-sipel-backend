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
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.MaintenanceDto;

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

import org.springframework.security.access.prepost.PreAuthorize;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
public class MaintenanceRestController {
    @Autowired
    private MaintenanceRestService maintenanceRestService;

    @Autowired
    private ManagedServicesRestService managedServicesRestService;

    @PostMapping(value = "/produksi/maintenance/tambah/{idOrderMS}")
    @PreAuthorize("hasRole('ADMIN')")
    public MaintenanceModel createMaintenanceSchedule(
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
    @PreAuthorize("hasRole('ADMIN')")
    public List<MaintenanceModel> retrieveListMaintenanceByIdOrderMs(
            @Valid
            @PathVariable ("idOrderMS") Long idOrderMS
    ) {
        return maintenanceRestService.retrieveMaintenanceMS(idOrderMS);
    }

    @PutMapping(value = "/produksi/maintenance/ubah/{idMaintenance}")
    @PreAuthorize("hasRole('ADMIN')")
    public MaintenanceModel changeMaintenance(
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
    @PreAuthorize("hasRole('ADMIN')")
    public MaintenanceModel detailMaintenance(
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteMaintenance(
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
    @PreAuthorize("hasRole('ADMIN')")
    public List<MaintenanceModel> retrieveListMaintenance(){
        return maintenanceRestService.retrieveListMaintenance();
    }

    @PutMapping(value="/order/{idOrder}/ms/{idOrderMs}/maintenance/{idMaintenance}/updateStatus")
    @PreAuthorize("hasRole('ADMIN')")
    public BaseResponse<MaintenanceDto> updateStatus(@Valid @RequestBody MaintenanceDto maintenance,
                                                      BindingResult bindingResult){
        BaseResponse<MaintenanceDto> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("Perubahan status maintenance gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(maintenance);
        maintenanceRestService.updateStatus(maintenance.getIdMaintenance(), maintenance.getMaintained());
        return response;
    }
}
