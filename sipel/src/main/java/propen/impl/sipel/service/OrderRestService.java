package propen.impl.sipel.service;

import propen.impl.sipel.model.OrderModel;

import java.util.List;

public interface OrderRestService {

    //Method untuk mencari list order
    List<OrderModel> getOrderList();

    //method untuk mencari order berdasarkan id
    OrderModel getOrderByIdOrder(Long idOrder);

    //method untuk mengubah status order
    OrderModel updateStatusOrder(Long idOrder, OrderModel order);
}
