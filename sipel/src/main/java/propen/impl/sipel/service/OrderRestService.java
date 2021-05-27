package propen.impl.sipel.service;

import propen.impl.sipel.model.OrderModel;

import java.util.List;

public interface OrderRestService {
    OrderModel createOrder(OrderModel order);

    List<OrderModel> retrieveOrder();

    OrderModel getOrderById(Long idOrder);

    OrderModel changeOrder(Long idOrder, OrderModel orderUpdate);

    List<OrderModel> retrieveOrderIsMS();

    OrderModel getLatestOrder();

    List<OrderModel> retrieveListOrderVerified();
}
