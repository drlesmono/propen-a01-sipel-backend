package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.service.OrderRestService;

import java.util.List;
import java.util.NoSuchElementException;

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

    @GetMapping(value = "order/with-status")
    private List<OrderModel> retrieveListOrder() {
        return orderRestService.getOrderList();
    }

    @PutMapping(value = "/order/change-status/{idOrder}")
    private OrderModel updateStatusOrder(@PathVariable("idOrder") Long idOrder, @RequestBody OrderModel order) {
        try {
            return orderRestService.updateStatusOrder(idOrder, order);
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Order with ID " + String.valueOf(idOrder) + " Not Found!");
            // TODO: handle exception
        }
    }

}
