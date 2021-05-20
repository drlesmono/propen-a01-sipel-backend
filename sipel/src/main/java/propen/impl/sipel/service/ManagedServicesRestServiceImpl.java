package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.repository.ManagedServicesDb;
import propen.impl.sipel.rest.Setting;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@Transactional
public class ManagedServicesRestServiceImpl implements ManagedServicesRestService {
    private final WebClient webClient;

    @Autowired
    private ManagedServicesDb managedServicesDb;

    @Override
    public ManagedServicesModel createOrderMS(ManagedServicesModel managedServices) {
        managedServices.setActivated(false);
        managedServices.setDateClosedMS(null);
        managedServices.setTimeRemaining(setRem(managedServices));
        return managedServicesDb.save(managedServices);
    }

    @Override
    public ManagedServicesModel changeOrderMS(Long idOrderMS, ManagedServicesModel orderMSUpdate) {
        ManagedServicesModel orderMS = getMSOrderById(idOrderMS);
        orderMS.setActivated(orderMSUpdate.getActivated());
        orderMS.setDateClosedMS(null);
        orderMS.setTimeRemaining(orderMSUpdate.getTimeRemaining());
        orderMS.setActualStart(orderMSUpdate.getActualStart());
        orderMS.setActualEnd(orderMSUpdate.getActualEnd());
        orderMS.setIdUserPic(orderMSUpdate.getIdUserPic());
        return managedServicesDb.save(orderMS);
    }

    @Override
    public ManagedServicesModel getMSOrderById(Long idOrderMS) {
        Optional<ManagedServicesModel> orderMS = managedServicesDb.findById(idOrderMS);
        if (orderMS.isPresent()) {
            return orderMS.get();
        }
        else {
            throw new NoSuchElementException();
        }
    }

    @Override
    public Long setRem(ManagedServicesModel managedServices) {
        Date startPeriod = managedServices.getActualStart();
        Date endPeriod = managedServices.getActualEnd();
        LocalDate ldStartPeriod = startPeriod.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate ldEndPeriod = endPeriod.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate dateStart = LocalDate.of(ldStartPeriod.getYear(), ldStartPeriod.getMonth(), ldStartPeriod.getDayOfMonth());
        LocalDate dateEnd = LocalDate.of(ldEndPeriod.getYear(), ldEndPeriod.getMonth(), ldEndPeriod.getDayOfMonth());
        Long days = ChronoUnit.DAYS.between(dateStart, dateEnd);

        return days;
    }

    @Override
    public List<ManagedServicesModel> retrieveMS() {
        return managedServicesDb.findAll();
    }

    @Override
    public List<ManagedServicesModel> retrieveMSassigned() {
        List<ManagedServicesModel> msList = retrieveMS();
        List<ManagedServicesModel> msListAssigned = new ArrayList<ManagedServicesModel>();
        for (ManagedServicesModel i : msList) {
            if (i.getIdUserPic() != null && i.getTimeRemaining() != 0) {
                msListAssigned.add(i);
            }
        }
        return msListAssigned;
    }

    public ManagedServicesRestServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(Setting.orderMSURl).build();
    }
}
