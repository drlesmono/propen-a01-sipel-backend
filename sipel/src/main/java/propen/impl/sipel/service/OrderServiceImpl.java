package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.repository.OrderDb;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {
    @Autowired
    OrderDb orderDb;

    @Override
    public void addOrder(OrderModel order) {
        orderDb.save(order);
    }

    @Override
    public OrderModel updateOrder(OrderModel orderModel) {
        orderDb.save(orderModel);

        return orderModel;
    }

    @Override
    public List<OrderModel> getOrderList() {
        return orderDb.findAll();
    }

    @Override
    public Optional<OrderModel> getOrderById(Long idOrder) {
        return orderDb.findById(idOrder);
    }

    @Override
    public OrderModel buildNewOrder() {
        OrderModel newOrder = new OrderModel();
        newOrder.setProjectInstallation(true);
        newOrder.setManagedService(false);

        return newOrder;
    }
}
