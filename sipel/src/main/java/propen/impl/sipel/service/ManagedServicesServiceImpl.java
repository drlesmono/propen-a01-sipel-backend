package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.repository.ManagedServicesDb;

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
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
    public Optional<ManagedServicesModel> getOrderMSById(Long idOrderMs) {
        return managedServicesDb.findById(idOrderMs);
    }

    @Override
    public Long setTimeRem(ManagedServicesModel managedServices) {
        Date startPeriod = managedServices.getActualStart();
        Date endPeriod = managedServices.getActualEnd();
        LocalDate ldStartPeriod = startPeriod.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate ldEndPeriod = endPeriod.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        Period gap = Period.between(ldStartPeriod, ldEndPeriod);
        Long days = Long.valueOf(gap.getDays());

        return days;
    }
}
