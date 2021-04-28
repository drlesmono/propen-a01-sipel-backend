/*
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

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

@Controller
public class OrderController {
    @Qualifier("orderServiceImpl")
    @Autowired
    private OrderService orderService;

    @Autowired
    private ProjectInstallationService projectInstallationService;

    @Autowired
    private ManagedServicesService managedServicesService;

    @Autowired
    private ServicesService servicesService;

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
            HttpServletRequest request,
            Model model
    ) {
        Date today = new Date();
        order.setDateOrder(today);
        order.setVerified(false);
        orderService.addOrder(order);
        model.addAttribute("namaOrder", order.getOrderName());

        order.setManagedService(true);
        if (isOrderPIExist(order)) {
            //projectInstallation.setIdOrder(order);
            projectInstallation.setPercentage(0.00F);
            projectInstallation.setClose(false);
            projectInstallation.setDateClosedPI(null);
            projectInstallationService.addOrderPI(projectInstallation);
        }
        if (isOrderMSExist(order)) {
            //managedServices.setIdOrder(order);
            managedServices.setActivated(false);
            managedServices.setDateClosedMS(null);
            managedServices.setTimeRemaining(managedServicesService.setTimeRem(managedServices));
            managedServicesService.addOrderMS(managedServices);
        }
        if (isOrderMSExist(order)) {
            String[] serviceName = request.getParameterValues("name");
            for (int i = 0; i < serviceName.length; i++) {
                managedServices.addService(serviceName[i]);
                ServicesModel service = new ServicesModel();
                service.setName(serviceName[i]);
                service.setIdOrderMS(managedServices);
                servicesService.addServices(service);
            }
        }

        return "display-success";
    }

    @GetMapping("/order/detail-order/{idOrder}")
    public String getOrdDetail(
            @PathVariable(value = "idOrder") Long idOrder,
            Model model
    ) {
        if (idOrder != null) {
            if (isOrderExist(idOrder)) {
                OrderModel order = orderService.getOrderById(idOrder).get();
                if (order.isProjectInstallation() && order.isManagedService()) {
                    ProjectInstallationModel projectInstallation = order.getIdOrderPi();
                    ManagedServicesModel managedServices = order.getIdOrderMs();
                    List<ServicesModel> listServices = managedServices.getListService();
                    model.addAttribute("order", order);
                    model.addAttribute("projectInstallation", projectInstallation);
                    model.addAttribute("managedServices", managedServices);
                    model.addAttribute("listServices", listServices);

                    return "ord-PIMS-detail";
                }
                if (order.isProjectInstallation() && !order.isManagedService()) {
                    ProjectInstallationModel projectInstallation = order.getIdOrderPi();
                    model.addAttribute("order", order);
                    model.addAttribute("projectInstallation", projectInstallation);

                    return "ord-PI-detail";
                }
                if (order.isManagedService() && !order.isProjectInstallation()) {
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

    @GetMapping("/order/ubah-order/{idOrder}")
    public String editOrder(
            @PathVariable(required = false) Long idOrder,
            Model model
    ) {
        if (idOrder != null && isOrderExist(idOrder)) {
            OrderModel order = orderService.getOrderById(idOrder).get();
            model.addAttribute("order", order);
            if (order.isProjectInstallation()) {
                ProjectInstallationModel orderPI = order.getIdOrderPi();
                model.addAttribute("orderPI", orderPI);
            }
            else if (order.isManagedService()) {
                ManagedServicesModel orderMS = order.getIdOrderMs();
                List<ServicesModel> listServices = orderMS.getListService();
                model.addAttribute("listServices", listServices);
                for (ServicesModel i : listServices) {
                    model.addAttribute("service", i);
                }
                model.addAttribute("orderMS", orderMS);
            }
            return "form-edit-order";
        }
        model.addAttribute("msg", "Id Order tidak dapat ditemukan");
        return "error";
    }

    @PostMapping("/order/ubah-order/{idOrder}")
    public String saveEditOrder(
            @ModelAttribute OrderModel order,
            @ModelAttribute ProjectInstallationModel projectInstallation,
            @ModelAttribute ManagedServicesModel managedServices,
            Model model
    ) {
        OrderModel editedOrder = orderService.updateOrder(order);
        ProjectInstallationModel editedOrderPI = projectInstallationService.updateOrderPI(projectInstallation);
        ManagedServicesModel editedOrderMS = managedServicesService.updateOrderMS(managedServices);
        model.addAttribute("order", editedOrder);
        model.addAttribute("orderPI", editedOrderPI);
        model.addAttribute("orderMS", editedOrderMS);

        return "display-success-edit";
    }

    private boolean isOrderExist(Long idOrder) {
        return orderService.getOrderById(idOrder).isPresent();
    }

    private boolean isOrderPIExist(OrderModel order) {
        return order.isProjectInstallation();
    }

    private boolean isOrderMSExist(OrderModel order) {
        return order.isManagedService();
    }
}
*/
