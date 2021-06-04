package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.MaintenanceModel;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.repository.MaintenanceDb;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@Transactional
public class MaintenanceRestServiceImpl implements MaintenanceRestService {
    @Autowired
    private MaintenanceDb maintenanceDb;

    @Override
    public MaintenanceModel createMaintenance (MaintenanceModel maintenance, ManagedServicesModel ms) {
        maintenance.setIdOrderMS(ms);
        maintenance.setMaintained(false);
        return maintenanceDb.save(maintenance);
    }

    @Override
    public List<MaintenanceModel> retrieveMaintenanceMS(Long idOrderMs) {
        List<MaintenanceModel> mnList = retrieveListMaintenance();
        List<MaintenanceModel> mnListMS = new ArrayList<MaintenanceModel>();
        for (MaintenanceModel i : mnList) {
            if (i.getIdOrderMS().getIdOrderMs() == idOrderMs) {
                mnListMS.add(i);
            }
        }
        return mnListMS;
    }

    @Override
    public MaintenanceModel getMaintenanceById(Long idMaintenance) {
        Optional<MaintenanceModel> maintenance = maintenanceDb.findById(idMaintenance);
        if (maintenance.isPresent()) {
            return maintenance.get();
        }
        else {
            throw new NoSuchElementException();
        }
    }

    @Override
    public MaintenanceModel changeMaintenance(Long idMaintenance, MaintenanceModel maintenance) {
        MaintenanceModel mn = getMaintenanceById(idMaintenance);
        mn.setDateMn(maintenance.getDateMn());
        return maintenanceDb.save(mn);
    }

    @Override
    public void deleteMaintenance(Long idMaintenance) {
        MaintenanceModel maintenance = getMaintenanceById(idMaintenance);
        maintenanceDb.delete(maintenance);
    }

    // Mencari seluruh maintenance
    @Override
    public List<MaintenanceModel> retrieveListMaintenance() {
        return maintenanceDb.findAll();
    }

    @Override
    public MaintenanceModel updateStatus(Long idMaintenance, Boolean status) {
        MaintenanceModel maintenanceTarget = maintenanceDb.findById(idMaintenance).get();
        maintenanceTarget.setMaintained(status);
        return maintenanceDb.save(maintenanceTarget);
    }
}
