package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.model.ServicesModel;
import propen.impl.sipel.repository.OrderDb;
import propen.impl.sipel.service.ManagedServicesRestService;
import propen.impl.sipel.service.OrderRestService;
import propen.impl.sipel.service.ProjectInstallationRestService;
import propen.impl.sipel.service.ServicesRestService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1")
public class  OrderRestController {
    @Autowired
    private OrderRestService orderRestService;

    @Autowired
    private ProjectInstallationRestService projectInstallationRestService;

    @Autowired
    private ManagedServicesRestService managedServicesRestService;

    @Autowired
    private ServicesRestService servicesRestService;

    @Autowired
    private OrderDb orderDb;

    @PostMapping(value = "/order/tambah")
    public OrderModel createOrder(
            @Valid
            @RequestBody OrderModel order,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request body has invalid type or missing field"
            );
        }
        else {
            return orderRestService.createOrder(order);
        }
    }

    @GetMapping(value = "/order/detail/{idOrder}")
    private OrderModel retrieveOrder(
            @PathVariable(value = "idOrder") Long idOrder
    ) {
        try {
            return orderRestService.getOrderById(idOrder);
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Order with ID " + String.valueOf(idOrder) + " not found!"
            );
        }
    }

    @PutMapping(value = "/order/ubah/{idOrder}")
    private OrderModel updateOrder(
            @PathVariable(value = "idOrder") Long idOrder,
            @RequestBody OrderModel order
    ) {
        try {
            return orderRestService.changeOrder(idOrder, order);
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Order with ID " + String.valueOf(idOrder) + " not found!"
            );
        }
    }

    @GetMapping(value = "/orderList")
    private List<OrderModel> retrieveListOrder() {
        return orderRestService.retrieveOrder();
    }

    @GetMapping(value = "/orderListIsMS")
    private List<OrderModel> retrieveOrdListMS() {
        return orderRestService.retrieveOrderIsMS();
    }

    @GetMapping(value = "/order/target")
    private OrderModel retrieveOrderTarget() {
        return orderRestService.getLatestOrder();
    }

    @GetMapping(value="/ordersVerifiedReport")
    private List<OrderModel> retrieveListOrderVerifiedReport(){
        List<OrderModel> listOrder = orderRestService.retrieveListOrderVerified();

        List<OrderModel> listOrderFiltered = new ArrayList<>();
        for(OrderModel order : listOrder){
            if(order.getNoPO() != null){
                listOrderFiltered.add(order);
            }
        }

        return listOrder;
    }
}
