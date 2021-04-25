package propen.impl.sipel.service;

import propen.impl.sipel.model.OrderModel;

import java.util.List;

public interface OrderRestService {

    List<OrderModel> retrieveListOrderVerified();

    OrderModel findOrderById(Long idOrder);

    List<OrderModel> retrieveListOrderMs();
}
