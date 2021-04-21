package propen.impl.sipel.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.repository.OrderDb;

import javax.transaction.Transactional;
import java.util.List

@Service
@Transactional
public class OrderServiceImpl implements OrderService{

    @Autowired
    OrderDb orderDb;

    @Override
    public List<OrderModel> getOrderList(){
        return orderDb.findAll(Sort.by("idOrder").descending());
    }

    @Override
    public OrderModel getOrderByIdOrder (Long idOrder) {
        return orderDb.findById(idOrder).get();
    }

    @Override
    public OrderModel updateStatusOrder(OrderModel order) {
        OrderModel targetOrder = orderDb.findById(order.getIdOrder()).get();
        try {
            orderDb.save(targetOrder);
            return targetOrder;
        } catch (NullPointerException nullException) {
            //TODO: handle exception
            return null;
        }


    }
}
