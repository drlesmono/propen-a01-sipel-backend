package propen.impl.sipel.service;

import propen.impl.sipel.model.OrderModel;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    void addOrder(OrderModel order);

    OrderModel updateOrder(OrderModel orderModel);

    List<OrderModel> getOrderList();

    Optional<OrderModel> getOrderById(Long idOrder);

    OrderModel buildNewOrder();
}
