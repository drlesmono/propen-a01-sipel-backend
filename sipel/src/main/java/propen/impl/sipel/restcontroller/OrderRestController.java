package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.ManagedServicesDto;
import propen.impl.sipel.rest.OrderDto;
import propen.impl.sipel.rest.ProgressOrderDto;
import propen.impl.sipel.service.ManagedServicesRestService;
import propen.impl.sipel.service.OrderRestService;

import javax.validation.Valid;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class OrderRestController {

    @Autowired
    private OrderRestService orderRestService;

    @Autowired
    private ManagedServicesRestService managedServicesRestService;

    // Mengembalikan list seluruh order yang telah terverifikasi
    @GetMapping(value="/ordersVerified")
    private List<OrderModel> retrieveListOrderVerified(){
        return orderRestService.retrieveListOrderVerified();
    }

    // Mengembalikan list seluruh order jenis managed services yang telah terverifikasi
    @GetMapping(value="/ordersVerified/ms")
    private List<OrderModel> retrieveListOrderMS() {
        List<ManagedServicesModel> listMs = managedServicesRestService.msOrderByActualEnd();

        List<OrderModel> listOrder = new ArrayList<>();
        for(ManagedServicesModel ms : listMs){
            OrderModel order = orderRestService.findOrderById(ms.getIdOrder().getIdOrder());
            listOrder.add(order);
        }

        return listOrder;
    }

    // Mengembalikan list order yang telah terverifikasi dan sudah memiliki nomor PO
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

    // Membuat order baru dengan data yang sama dengan order lama dan periode kontrak baru
    // Mengembalikan response dengan result order baru yang berhasil dibuat
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

        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(newOrder);

        return response;
    }

    @GetMapping(value = "/order/progress")
    public List<ProgressOrderDto> showAllProgress(Model model){
        List<ProgressOrderDto> allProgress = orderRestService.getAllProgress();
        return allProgress;
    }

}
