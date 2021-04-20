package propen.impl.sipel.controller;

import org.springframework.beans.factory.annotation.Qualifier;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.model.ServicesModel;
import propen.impl.sipel.service.OrderService;
import propen.impl.sipel.service.ProjectInstallationService;
import propen.impl.sipel.service.ManagedServicesService;
import propen.impl.sipel.service.ServicesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Controller
public class OrderController {
    @Qualifier("orderServiceImpl")
    @Autowired
    OrderService orderService;

    @Autowired
    ProjectInstallationService projectInstallationService;

    @Autowired
    ManagedServicesService managedServicesService;

    @Autowired
    ServicesService servicesService;

    @GetMapping("/order/tambah-order")
    public String createOrder(Model model) {
        model.addAttribute("order", orderService.buildNewOrder());
        model.addAttribute("projectInstallation", new ProjectInstallationModel());
        model.addAttribute("managedService", new ManagedServicesModel());
        model.addAttribute("services", new ServicesModel());

        return "form-create-order";
    }

    @PostMapping("/order/tambah-order")
    public String saveInputOrder(
            @ModelAttribute OrderModel order,
            @ModelAttribute ProjectInstallationModel projectInstallation,
            @ModelAttribute ManagedServicesModel managedServices,
            @ModelAttribute ServicesModel services,
            Model model
    ) {
        Date today = new Date();
        order.setDateOrder(today);
        order.setVerified(false);
        orderService.addOrder(order);
        model.addAttribute("namaOrder", order.getOrderName());

        order.setProjectInstallation(true);
        order.setManagedService(true);
        boolean flagPI = order.isProjectInstallation();
        boolean flagMS = order.isManagedService();
        if (flagPI == true) {
            projectInstallation.setIdOrder(order);
            projectInstallation.setPercentage(0.00F);
            projectInstallation.setClose(false);
            projectInstallation.setDateClosedPI(null);
            projectInstallationService.addOrderPI(projectInstallation);
        }
        if (flagMS == true) {
            managedServices.setIdOrder(order);
            managedServices.setActivated(false);
            managedServices.setDateClosedMS(null);
            managedServices.setTimeRemaining(managedServicesService.setTimeRem(managedServices));
            managedServicesService.addOrderMS(managedServices);
            services.setIdOrderMS(managedServices);
            servicesService.addServices(services);
        }

        return "display-success";
    }

    @GetMapping("/order/detail-order")
    public String getOrdDetail(
            @RequestParam(value = "idOrder") Long idOrder,
            Model model
    ) {
        if (idOrder != null) {
            if (isOrderExist(idOrder)) {
                OrderModel order = orderService.getOrderById(idOrder).get();
                if (order.isProjectInstallation()){
                    ProjectInstallationModel projectInstallation = order.getIdOrderPi();
                    model.addAttribute("order", order);
                    model.addAttribute("projectInstallation", projectInstallation);

                    return "ord-PI-detail";
                }
                if (order.isManagedService()){
                    ManagedServicesModel managedServices = order.getIdOrderMs();
                    List<ServicesModel> listServices = managedServices.getListService();
                    model.addAttribute("order", order);
                    model.addAttribute("managedServices", managedServices);
                    model.addAttribute("listServices", listServices);

                    return "ord-MS-detail";
                }
            }
        }
        model.addAttribute("msg", "Order tidak ditemukan!");

        return "error";
    }

    private boolean isOrderExist(Long idOrder) {
        return orderService.getOrderById(idOrder).isPresent();
    }
}
