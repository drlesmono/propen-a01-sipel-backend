package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.repository.OrderDb;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.ManagedServicesDto;
import propen.impl.sipel.rest.OrderDto;
import propen.impl.sipel.service.ManagedServicesRestService;
import propen.impl.sipel.service.OrderRestService;

import javax.validation.Valid;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
public class OrderRestController {

    @Autowired
    private OrderRestService orderRestService;

    @Autowired
    private OrderDb orderDb;

    @Autowired
    private ManagedServicesRestService managedServicesRestService;

    @GetMapping("/ordersVerified")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<OrderModel> retrieveListOrderVerified(){
        return orderRestService.retrieveListOrderVerified();
    }

    @GetMapping(value="/ordersVerified/ms")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<OrderModel> retrieveListOrderMS() {
        List<ManagedServicesModel> listMs = managedServicesRestService.msOrderByActualEnd();

        List<OrderModel> listOrder = new ArrayList<>();
        for(ManagedServicesModel ms : listMs){
            OrderModel order = orderRestService.findOrderById(ms.getIdOrder().getIdOrder());
            listOrder.add(order);
        }

        return listOrder;
//        return orderRestService.retrieveListOrderMs();
    }

    @GetMapping(value="/ordersVerifiedReport")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<OrderModel> retrieveListOrderVerifiedReport(){
        List<OrderModel> listOrder = orderRestService.retrieveListOrderVerified();

        List<OrderModel> listOrderFiltered = new ArrayList<>();
        for(OrderModel order : listOrder){
            if(order.getNoPO() != null){
                listOrderFiltered.add(order);
            }
        }

        return listOrder;
    }

    @PutMapping(value="/order/{idOrder}/perpanjangKontrak")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public BaseResponse<OrderModel> extendKontrak(@Valid @RequestBody OrderDto order,
                                                 BindingResult bindingResult){
        BaseResponse<OrderModel> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("Pembuatan order baru untuk perpanjangan kontrak gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        OrderModel newOrder = orderRestService.extendKontrak(order.getIdOrder(), order.getNoPO());

        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(newOrder);

        return response;
    }

    @GetMapping(value="/order-verification")
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderModel> getAllNotVerifiedOrders(){
        //List<OrderModel> listNotVerifiedOrder = 

        return orderRestService.retrieveListNotVerifiedOrder();
    }

    @GetMapping(value="/order-details/{idOrder}")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderModel getOrderByIdOrder(@PathVariable Long idOrder, Model model){
        OrderModel order = orderDb.findByIdOrder(idOrder);
        return order;
    }

    @PutMapping("/verification/{idOrder}")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderModel updateStatusVerifikasi(@PathVariable Long idOrder, @RequestBody OrderModel order){
        
        OrderModel targetedOrder = orderDb.findByIdOrder(idOrder);
        targetedOrder.setVerified(order.getVerified());
        return orderDb.save(targetedOrder);
        //ResponseEntity.ok(updatedTask);
    }

}
