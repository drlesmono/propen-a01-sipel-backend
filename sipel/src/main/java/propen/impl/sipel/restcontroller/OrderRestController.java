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

    /*@PostMapping(value = "/order/tambah")
    private OrderModel createOrder(
            @Valid
            @RequestBody OrderModel order,
            //@RequestBody ProjectInstallationModel projectInstallation,
            //@RequestBody ManagedServicesModel managedServices,
            //@RequestBody ServicesModel services,
            //HttpServletRequest request,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasFieldErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Request body has invalid type or missing field"
            );
        }
        else {
            Date today = new Date();
            order.setDateOrder(today);
            order.setVerified(false);
            return orderRestService.createOrder(order);
            *//*String[] valPI = request.getParameterValues("isProjectInstallation");
            boolean flagPI = false;
            for (int k = 0; k < valPI.length; k++) {
                flagPI = Boolean.parseBoolean(valPI[k]);
            }
            String[] valMS = request.getParameterValues("isManagedServices");
            boolean flagMS = false;
            for (int j = 0; j < valMS.length; j++) {
                flagMS = Boolean.parseBoolean(valMS[j]);
            }
            if (flagPI) {
                projectInstallation.setIdOrder(order);
                return projectInstallationRestService.createOrderPI(projectInstallation);
            }
            if (flagMS) {
                managedServices.setIdOrder(order);
                return managedServicesRestService.createOrderMS(managedServices);
            }
            if (flagMS) {
                String[] serviceName = request.getParameterValues("name");
                for (int i = 0; i < serviceName.length; i++) {
                    managedServices.addService(serviceName[i]);
                    ServicesModel service = new ServicesModel();
                    service.setName(serviceName[i]);
                    service.setIdOrderMS(managedServices);
                    return servicesRestService.createServices(service);
                }
            }*//*
        }
        //return order;
    }*/

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

    /*@GetMapping(value = "/order/detail/{idOrder}")
    private Object retrieveOrder(
            @PathVariable(value = "idOrder") Long idOrder
    ) {
        try {
            OrderModel order = orderRestService.getOrderById(idOrder);
            if (order.isProjectInstallation()){
                ProjectInstallationModel orderPI = order.getIdOrderPi();
                return orderPI;
            }
            if (order.isManagedService()) {
                ManagedServicesModel orderMS = order.getIdOrderMs();
                List<ServicesModel> listServices = orderMS.getListService();
                for (ServicesModel i : listServices) {
                    return i;
                }
                return orderMS;
            }
            return order;
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Order with ID " + String.valueOf(idOrder) + " not found!"
            );
        }
    }*/

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

    /*@PutMapping(value = "/order/ubah/{idOrder}")
    private Object updateOrder(
            @PathVariable(value = "idOrder") Long idOrder,
            @RequestBody OrderModel order,
            @RequestBody ProjectInstallationModel projectInstallation,
            @RequestBody ManagedServicesModel managedServices,
            @RequestBody ServicesModel services,
            HttpServletRequest request
    ) {
        try {
            if (order.isProjectInstallation()) {
                return projectInstallationRestService.changeOrderPI(order.getIdOrderPi().getIdOrderPi(), projectInstallation);
            }
            if (order.isManagedService()) {
                List<ServicesModel> list = managedServices.getListService();
                String[] serviceName = request.getParameterValues("name");
                for (int i = 0; i < serviceName.length; i++) {
                    ServicesModel service = list.get(i);
                    service.setIdOrderMS(managedServices);
                    return servicesRestService.changeServices(service.getIdService(), service);
                }
                return managedServicesRestService.changeOrderMS(order.getIdOrderMs().getIdOrderMs(), managedServices);

            }
            return orderRestService.changeOrder(idOrder, order);
        }
        catch (NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Order with ID " + String.valueOf(idOrder) + " not found!"
            );
        }
    }*/

    @GetMapping(value = "/orderList")
    private List<OrderModel> retrieveListOrder() {
        return orderRestService.retrieveOrder();
    }

    /*private List<ServicesModel> manageServices(ManagedServicesModel managedServices) {
        List<ServicesModel> listServices = new ArrayList<ServicesModel>();
        if (managedServices.getListService() != null) {
            for (Iterator<ServicesModel> i = managedServices.getListService().iterator(); i.hasNext();) {
                ServicesModel services = i.next();
                services.setIdOrderMS(managedServices);
                listServices.add(services);
                servicesRestService.createServices(services);
            }
        }
        return listServices;
    }

    private List<ServicesModel> manageUpdateServices(ManagedServicesModel managedServices) {
        List<ServicesModel> listServices = new ArrayList<ServicesModel>();
        if (managedServices.getListService() != null) {
            for (Iterator<ServicesModel> i = managedServices.getListService().iterator(); i.hasNext();) {
                ServicesModel services = i.next();
                services.setIdOrderMS(managedServices);
                listServices.add(services);
                servicesRestService.changeServices(services.getIdService(), services);
            }
        }
        return listServices;
    }*/
}
