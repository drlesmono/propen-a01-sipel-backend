package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.repository.OrderDb;
import propen.impl.sipel.rest.Setting;

import javax.transaction.Transactional;
import java.util.*;

@Service
@Transactional
public class OrderRestServiceImpl implements OrderRestService {
    private final WebClient webClient;

    @Autowired
    private OrderDb orderDb;

    @Override
    public OrderModel createOrder(OrderModel order) {
        Date today = new Date();
        order.setDateOrder(today);
        order.setVerified(false);
        return orderDb.save(order);
    }

    @Override
    public List<OrderModel> retrieveOrder() {
        return orderDb.findAll();
    }

    @Override
    public List<OrderModel> retrieveOrderIsMS() {
        List<OrderModel> ordList = retrieveOrder();
        List<OrderModel> ordMSList = new ArrayList<OrderModel>();
        for (OrderModel i : ordList) {
            if (i.isManagedService() && i.getIdOrderMs().getIdUserPic() != null) {
                ordMSList.add(i);
            }
        }
        return ordMSList;
    }

    @Override
    public OrderModel getOrderById(Long idOrder) {
        Optional<OrderModel> order = orderDb.findById(idOrder);
        if (order.isPresent()) {
            return order.get();
        }
        else {
            throw new NoSuchElementException();
        }
    }

    @Override
    public OrderModel changeOrder(Long idOrder, OrderModel orderUpdate) {
        OrderModel order = getOrderById(idOrder);
        Date today = new Date();
        order.setNoPO(orderUpdate.getNoPO());
        order.setNoSPH(orderUpdate.getNoSPH());
        order.setOrderName(orderUpdate.getOrderName());
        order.setDescription(orderUpdate.getDescription());
        order.setProjectInstallation(orderUpdate.isProjectInstallation());
        order.setManagedService(orderUpdate.isManagedService());
        order.setClientName(orderUpdate.getClientName());
        order.setClientDiv(orderUpdate.getClientDiv());
        order.setClientPIC(orderUpdate.getClientPIC());
        order.setClientOrg(orderUpdate.getClientOrg());
        order.setClientPhone(orderUpdate.getClientPhone());
        order.setClientEmail(orderUpdate.getClientEmail());
        order.setDateOrder(today);
        order.setVerified(false);
        return orderDb.save(order);
    }

    public OrderRestServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(Setting.orderURl).build();
    }
}
