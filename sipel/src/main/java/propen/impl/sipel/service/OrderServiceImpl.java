package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.SequenceModel;
import propen.impl.sipel.repository.OrderDb;
import propen.impl.sipel.repository.SequenceDb;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {
    @Autowired
    OrderDb orderDb;

    ///add disini
    @Autowired
    SequenceDb sequenceDb;

    @Override
    public void addOrder(OrderModel order) {
        SequenceModel seq = sequenceDb.findById(Long.valueOf(1)).get();
        Long seqCurrent = seq.getSequenceValue();
        order.setSequence(seqCurrent);
        seq.setSequenceValue(seqCurrent+1);
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
