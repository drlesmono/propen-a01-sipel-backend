package propen.impl.sipel.service;

import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.rest.ProgressOrderDto;

import java.util.List;

public interface OrderRestService {
    OrderModel createOrder(OrderModel order);

    List<OrderModel> retrieveOrder();

    OrderModel getOrderById(Long idOrder);

    OrderModel changeOrder(Long idOrder, OrderModel orderUpdate);

    OrderModel getLatestOrder();

    List<OrderModel> retrieveListOrderVerified();

    OrderModel findOrderById(Long idOrder);

    List<OrderModel> retrieveListOrderMs();

    OrderModel extendKontrak(Long idOrder, String noPO);

    ProgressOrderDto getProgress(OrderModel order, String tipe);
    List<ProgressOrderDto> getAllProgress();

    Float getProgressPI(OrderModel order);
    Float getProgressMS(OrderModel order);

    String getStatusPI(OrderModel order);
    String getStatusMS(OrderModel order);

    List<OrderModel> retrieveListNotVerifiedOrder();

    List<OrderModel> retrieveUnverifiedOrder();
}
