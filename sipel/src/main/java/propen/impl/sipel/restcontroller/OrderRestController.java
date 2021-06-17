package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.repository.OrderDb;
import propen.impl.sipel.service.ManagedServicesRestService;
import propen.impl.sipel.service.OrderRestService;
import propen.impl.sipel.service.ProjectInstallationRestService;
import propen.impl.sipel.service.ServicesRestService;

import javax.validation.Valid;
import java.util.*;

import org.springframework.ui.Model;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.OrderDto;
import propen.impl.sipel.rest.ProgressOrderDto;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
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
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
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

    @GetMapping(value="/order-details/{idOrder}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    public OrderModel getOrderByIdOrder(@PathVariable Long idOrder, Model model){
        OrderModel order = orderDb.findByIdOrder(idOrder);
        return order;
    }

    @PutMapping("/verification/{idOrder}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    public OrderModel updateStatusVerifikasi(@PathVariable Long idOrder, @RequestBody OrderModel order){

        OrderModel targetedOrder = orderDb.findByIdOrder(idOrder);
        targetedOrder.setVerified(order.getVerified());
        return orderDb.save(targetedOrder);
        //ResponseEntity.ok(updatedTask);
    }

    @PutMapping(value="/order/verification")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    public BaseResponse<OrderModel> updateOrder(@Valid @RequestBody OrderDto order,
                                              BindingResult bindingResult){
        BaseResponse<OrderModel> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("verifikasi gagal" );
            response.setStatus(405);
            return response;
        }
        OrderModel oldOrder = orderRestService.findOrderById(order.getIdOrder());


        if (order.getNama_verifikasi().equals("Verified")) {
            oldOrder.setVerified(true);
        } else {
            oldOrder.setVerified(false);
        }
        orderDb.save(oldOrder);
        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(oldOrder);
        return response;
    }

    @GetMapping(value="/order-verification")
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderModel> getAllNotVerifiedOrders(){
        //List<OrderModel> listNotVerifiedOrder =

        return orderRestService.retrieveListNotVerifiedOrder();
    }

    @GetMapping(value = "/order/detail/{idOrder}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    public OrderModel retrieveOrder(
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
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    public OrderModel updateOrder(
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
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    public List<OrderModel> retrieveListOrder() {
        return orderRestService.retrieveOrder();
    }

    @GetMapping(value = "/order/target")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    public OrderModel retrieveOrderTarget() {
        return orderRestService.getLatestOrder();
    }

    // Mengembalikan list seluruh order yang telah terverifikasi
    @GetMapping(value="/ordersVerified")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<OrderModel> retrieveListOrderVerified(){
        return orderRestService.retrieveListOrderVerified();
    }

    // Mengembalikan list seluruh order jenis managed services yang telah terverifikasi
    @GetMapping(value="/ordersVerified/ms")
    @PreAuthorize("hasRole('ADMIN')  or hasRole('ENGINEER')")
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
    @PreAuthorize("hasRole('ENGINEER') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('FINANCE')")
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
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('MANAGER') or hasRole('ENGINEER')")
    public List<ProgressOrderDto> showAllProgress(Model model){
        List<ProgressOrderDto> allProgress = orderRestService.getAllProgress();
        return allProgress;
    }

    @GetMapping(value = "/unverifiedOrders")
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderModel> retrieveListOrderUnverified() {
        return orderRestService.retrieveUnverifiedOrder();
    }

    @PutMapping(value = "/order/status/verification")
    @PreAuthorize("hasRole('ADMIN')")
    public BaseResponse<OrderModel> updateVerificationStatus(@Valid @RequestBody OrderDto order,
    BindingResult bindingResult){
        BaseResponse<OrderModel> response = new BaseResponse<>();
        System.out.println(order.getIdOrder());
        System.out.println(order.getIsVerified());
        if(bindingResult.hasFieldErrors()){
            response.setMessage("Status verifikasi order gagal disimpan" );
            response.setStatus(405);
            return response;
        }
        OrderModel oldOrder = orderDb.findById(order.getIdOrder()).get();
        oldOrder.setVerified(order.getIsVerified());
        orderDb.save(oldOrder);
        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(oldOrder);

        return response;
        
       
    }

}
