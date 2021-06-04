package propen.impl.sipel.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.service.OrderService;

import java.util.List;

@Controller
public class OrderController {

    @Qualifier("orderServiceImpl")
    @Autowired
    private OrderService orderService;

    @RequestMapping(value = "/order/status")
    public String viewOrderStatus(Model model) {
        List<OrderModel> listOrder = orderService.getOrderList();
        model.addAttribute("listOrder", listOrder);
        return "view-order-status";
    }

    @GetMapping(value = "/order/status/change/{idOrder}")
    public String changeOrderStatusPage(@PathVariable Long idOrder, Model model){
        OrderModel order = orderService.getOrderByIdOrder(idOrder);
        model.addAttribute("order", order);
        return "form-change-status";
    }

    @PostMapping("/order/status/change")
    public String changeOrderFormSubmit(@ModelAttribute OrderModel order, Model model) {
        OrderModel orderUpdated = orderService.updateStatusOrder(order);

        model.addAttribute("order", orderUpdated);
        return "update-status";
    }
}
