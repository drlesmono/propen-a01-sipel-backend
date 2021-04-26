package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.ManagedServicesDto;
import propen.impl.sipel.rest.OrderDto;
import propen.impl.sipel.service.OrderRestService;

import javax.validation.Valid;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1")
public class OrderRestController {

    @Autowired
    private OrderRestService orderRestService;

//    @Autowired
//    private ManagedServicesRestService managedServicesRestService;

    @GetMapping(value="/ordersVerified")
    private List<OrderModel> retrieveListOrderVerified(){
        return orderRestService.retrieveListOrderVerified();
    }

    @GetMapping(value="/orders/ms")
    private List<OrderModel> retrieveListOrderMS() {
//        List<ManagedServicesModel> listMs = managedServicesRestService.msOrderByTimeRemaining();

//        List<OrderModel> listOrder = new ArrayList<>();
//        for(ManagedServicesModel ms : listMs){
//            OrderModel order = orderRestService.findOrderById(ms.getIdOrder().getIdOrder());
//            listOrder.add(order);
//        }

//        return listOrder;
        return orderRestService.retrieveListOrderMs();
    }

    @PutMapping(value="/order/{idOrder}/perpanjangKontrak")
    private BaseResponse<OrderModel> extendKontrak(@Valid @RequestBody OrderDto order,
                                                 BindingResult bindingResult){
        BaseResponse<OrderModel> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("Pembuatan order baru untuk perpanjangan kontrak gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        OrderModel newOrder = orderRestService.extendKontrak(order.getIdOrder(), order.getNoPO());
//        DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd'T'hh:mm:ss");
//        String dateOrder = dateFormat.format(newOrder.getDateOrder());

//        System.out.println(newOrder.getIdOrder());
//        System.out.println(newOrder.getIdOrder());
//        System.out.println(newOrder.getOrderName());
//        System.out.println(dateOrder);
//        System.out.println(newOrder.getNoPO());
//        System.out.println(newOrder.getIdOrderMs());
//        order.setIdOrder(newOrder.getIdOrder());
//        order.setOrderName(newOrder.getOrderName());
//        order.setDateOrder(dateOrder);
//        order.setNoPO(newOrder.getNoPO());
//        order.setProjectInstallation(false);
//        order.setIdOrderPi(null);
//        order.setIdOrderMs(newOrder.getIdOrderMs().getIdOrderMs());

        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(newOrder);

        return response;
    }

}
