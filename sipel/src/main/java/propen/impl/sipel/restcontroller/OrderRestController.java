package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.service.ManagedServicesRestService;
import propen.impl.sipel.service.OrderRestService;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1")
public class OrderRestController {

    @Autowired
    private OrderRestService orderRestService;

    @Autowired
    private ManagedServicesRestService managedServicesRestService;

    @GetMapping(value="/ordersVerified")
    private List<OrderModel> retrieveListOrderVerified(){
        return orderRestService.retrieveListOrderVerified();
    }

    @GetMapping(value="/ordersByTimeRemaining")
    private List<OrderModel> retrieveListOrderByTimeRemaining() {
        List<ManagedServicesModel> listMs = managedServicesRestService.msOrderByTimeRemaining();

        List<OrderModel> listOrder = new ArrayList<>();
        for(ManagedServicesModel ms : listMs){
            OrderModel order = orderRestService.findOrderById(ms.getIdOrder().getIdOrder());
            listOrder.add(order);
        }

        return listOrder;
    }

}
