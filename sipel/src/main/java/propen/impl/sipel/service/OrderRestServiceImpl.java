package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.repository.OrderDb;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderRestServiceImpl implements OrderRestService{

    @Autowired
    private OrderDb orderDb;

    @Override
    public List<OrderModel> retrieveListOrderVerified() {
        List<OrderModel> listOrderVerified = new ArrayList<>();

        for(OrderModel order : orderDb.findAll()){
            if (order.getVerified() == true) {
                listOrderVerified.add(order);
            }
        }

        return listOrderVerified;
    }

    @Override
    public List<OrderModel> retrieveListNotVerifiedOrder(){
        List<OrderModel> listNotVerifiedOrer = new ArrayList<>();

        for(OrderModel order : orderDb.findAll()){
            if (order.getVerified() == false) {
                listNotVerifiedOrer.add(order);
            }
        }

        return listNotVerifiedOrer;
    }
}
