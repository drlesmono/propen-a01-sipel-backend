package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.model.UserModel;
import propen.impl.sipel.repository.ManagedServicesDb;
import propen.impl.sipel.repository.UserDb;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class ManagedServicesRestServiceImpl implements ManagedServicesRestService{

    @Autowired
    private ManagedServicesDb managedServicesDb;

    @Autowired
    private UserDb userDb;

    // Mencari seluruh order yang memiliki jenis managed service
    @Override
    public List<ManagedServicesModel> retrieveListMs() {
        return managedServicesDb.findAll();
    }

    // Mengubah data pic engineer
    @Override
    public ManagedServicesModel updatePIC(Long idOrderMs, String idUserPic) {
        ManagedServicesModel msTarget = managedServicesDb.findById(idOrderMs).get();
        msTarget.setIdUserPic(userDb.findById(idUserPic).get());
        return managedServicesDb.save(msTarget);
    }

    // Mencari seluruh order yang memiliki jenis managed service
    // Order diurutkan berdasarkan periode berakhir atau actual end
    @Override
    public List<ManagedServicesModel> msOrderByActualEnd() {
        return managedServicesDb.findByOrderByActualEnd();
    }

    // Mengubah data periode kontrak
    @Override
    public ManagedServicesModel updateKontrak(Long idOrderMs, String idUserPic, Date actualStart, Date actualEnd) {
        ManagedServicesModel msTarget = managedServicesDb.findById(idOrderMs).get();
        msTarget.setActualStart(actualStart);
        msTarget.setActualEnd(actualEnd);
        msTarget.setIdUserPic(userDb.findById(idUserPic).get());
        return managedServicesDb.save(msTarget);
    }
}
