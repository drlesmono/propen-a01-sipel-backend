package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import propen.impl.sipel.model.ServicesModel;
import propen.impl.sipel.repository.ServicesDb;

@Service
@Transactional
public class ServicesServiceImpl implements ServicesService {
    @Autowired
    ServicesDb servicesDb;

    @Override
    public void addServices(ServicesModel services) {
        servicesDb.save(services);
    }

    @Override
    public ServicesModel updateServices(ServicesModel servicesModel) {
        servicesDb.save(servicesModel);

        return servicesModel;
    }
}
