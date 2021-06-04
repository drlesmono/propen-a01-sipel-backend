package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.repository.ManagedServicesDb;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;

@Service
@Transactional
public class ManagedServicesServiceImpl implements ManagedServicesService {
    @Autowired
    ManagedServicesDb managedServicesDb;

    @Override
    public void addOrderMS(ManagedServicesModel managedServices) {
        managedServicesDb.save(managedServices);
    }

    @Override
    public ManagedServicesModel updateOrderMS(ManagedServicesModel managedServicesModel) {
        managedServicesDb.save(managedServicesModel);

        return managedServicesModel;
    }

    @Override
    public Optional<ManagedServicesModel> getOrderMSById(Long idOrder) {
        return managedServicesDb.findById(idOrder);
    }

    @Override
    public Long setTimeRem(ManagedServicesModel managedServices) {
        Date startPeriod = managedServices.getActualStart();
        Date endPeriod = managedServices.getActualEnd();
        LocalDate ldStartPeriod = startPeriod.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate ldEndPeriod = endPeriod.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate dateStart = LocalDate.of(ldStartPeriod.getYear(), ldStartPeriod.getMonth(), ldStartPeriod.getDayOfMonth());
        LocalDate dateEnd = LocalDate.of(ldEndPeriod.getYear(), ldEndPeriod.getMonth(), ldEndPeriod.getDayOfMonth());
        Long days = ChronoUnit.DAYS.between(dateStart, dateEnd);

        return days;
    }
}
