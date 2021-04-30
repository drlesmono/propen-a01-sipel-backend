package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.repository.ProjectInstallationDb;
import propen.impl.sipel.rest.Setting;

import javax.transaction.Transactional;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@Transactional
public class ProjectInstallationRestServiceImpl implements ProjectInstallationRestService {
    private final WebClient webClient;

    @Autowired
    private ProjectInstallationDb projectInstallationDb;

    @Override
    public ProjectInstallationModel createOrderPI(ProjectInstallationModel projectInstallation) {
        //projectInstallation.setPercentage(0.00F);
        //projectInstallation.setClose(false);
        //projectInstallation.setDateClosedPI(null);

        return projectInstallationDb.save(projectInstallation);
    }

    /* @Override
    public ProjectInstallationModel changeOrderPI(OrderModel order, Long idOrder, ProjectInstallationModel orderPIUpdate) {
        ProjectInstallationModel orderPI = order.getIdOrderPi();
        orderPI.setStartPI(orderPIUpdate.getStartPI());
        orderPI.setDeadline(orderPIUpdate.getDeadline());
        orderPI.setPercentage(orderPIUpdate.getPercentage());
        orderPI.setIdUserEng(orderPIUpdate.getIdUserEng());
        orderPI.setClose(false);
        orderPI.setDateClosedPI(null);
        return projectInstallationDb.save(orderPI);
    } */

    @Override
    public ProjectInstallationModel getPIOrderById(Long idOrderPI) {
        Optional<ProjectInstallationModel> orderPI = projectInstallationDb.findById(idOrderPI);
        if (orderPI.isPresent()) {
            return orderPI.get();
        }
        else {
            throw new NoSuchElementException();
        }
    }

    @Override
    public List<ProjectInstallationModel> retrievePI() {
        return projectInstallationDb.findAll();
    }

    public ProjectInstallationRestServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(Setting.orderPIURl).build();
    }
}
