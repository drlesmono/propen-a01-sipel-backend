package propen.impl.sipel.controller;

import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.service.OrderService;
import propen.impl.sipel.service.ProjectInstallationService;
import propen.impl.sipel.service.ManagedServicesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@Controller
public class OrderController {
    @Autowired
    OrderService orderService;

    @Autowired
    ProjectInstallationService projectInstallationService;

    @Autowired
    ManagedServicesService managedServicesService;

    @GetMapping("/order/tambah-gaji")
    public String createOrder(Model model) {
        model.addAttribute("order", new OrderModel());
        model.addAttribute("projectInstallation", new ProjectInstallationModel());
        model.addAttribute("managedService", new ManagedServicesModel());

        return "form-create-order";
    }

    @PostMapping("/order/tambah-order")
    public String saveInputOrder(
            @ModelAttribute OrderModel order,
            @ModelAttribute ProjectInstallationModel projectInstallation,
            @ModelAttribute ManagedServicesModel managedServices,
            Model model
    ) {
        if (order.getProjectInstallation()) {
            projectInstallation.setPercentage(0.00F);
            projectInstallation.setClose(false);
            projectInstallation.setDateClosedPI(null);
            projectInstallationService.addOrderPI(projectInstallation);
        }
        if (order.getManagedService()) {
            managedServices.setActivated(false);
            managedServices.setDateClosedMS(null);
            managedServices.setTimeRemaining(managedServicesService.setTimeRem(managedServices));
            managedServicesService.addOrderMS(managedServices);
        }
        Date today = new Date();
        order.setDateOrder(today);
        orderService.addOrder(order);
        model.addAttribute("namaOrder", order.getOrderName());

        return "display-success";
    }
}
