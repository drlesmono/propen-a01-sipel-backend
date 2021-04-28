package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.service.OrderRestService;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1")
public class OrderRestController {

    @Autowired
    private OrderRestService orderRestService;

    @GetMapping(value="/ordersVerified")
    private List<OrderModel> retrieveListOrderVerified(){
        return orderRestService.retrieveListOrderVerified();
    }

    @GetMapping(value="/order-verification")
    private List<OrderModel> getAllNotVerifiedOrders(){
        //List<OrderModel> listNotVerifiedOrder = 

        return orderRestService.retrieveListNotVerifiedOrder();
    }

}
