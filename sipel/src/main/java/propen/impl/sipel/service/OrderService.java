package propen.impl.sipel.service;

import org.hibernate.criterion.Order;
import propen.impl.sipel.model.OrderModel;

import java.util.List;

public interface OrderService {

    //Method untuk mencari list order
    List<OrderModel> getOrderList();

    //method untuk mencari order berdasarkan id
    OrderModel getOrderByIdOrder(Long idOrder);

    //method untuk mengubah status order
    OrderModel updateStatusOrder(OrderModel order);
}
