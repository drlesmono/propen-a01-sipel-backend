package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
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

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.ManagedServicesDto;
import propen.impl.sipel.rest.OrderDto;
import propen.impl.sipel.rest.ProgressOrderDto;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
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

    // Mengembalikan list seluruh order yang telah terverifikasi
    @GetMapping("/ordersVerified")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<OrderModel> retrieveListOrderVerified(){
        return orderRestService.retrieveListOrderVerified();
    }

    // Mengembalikan list seluruh order jenis managed services yang telah terverifikasi
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
    }

    // Mengembalikan list order yang telah terverifikasi dan sudah memiliki nomor PO
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

    // Membuat order baru dengan data yang sama dengan order lama dan periode kontrak baru
    // Mengembalikan response dengan result order baru yang berhasil dibuat
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

    @GetMapping(value = "/order/progress")
    public List<ProgressOrderDto> showAllProgress(Model model){
        List<ProgressOrderDto> allProgress = orderRestService.getAllProgress();
        return allProgress;
    }

}
