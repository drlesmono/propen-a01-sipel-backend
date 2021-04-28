package propen.impl.sipel.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import propen.impl.sipel.model.DocumentOrderModel;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.repository.DocumentOrderDb;
import propen.impl.sipel.service.OrderService;
//import propen.impl.sipel.service.OrderService;

import java.util.Date;

@Controller
public class DocumentOrderController {
    @Autowired
    DocumentOrderDb documentOrderDb;

    @Autowired
    OrderService orderService;

    @GetMapping("/order/detail-order/{idOrder}/upload")
    public String viewHomePage(
            @PathVariable(value = "idOrder") Long idOrder,
            Model model
    ) {
        DocumentOrderModel document = new DocumentOrderModel();
        OrderModel order = orderService.getOrderById(idOrder).get();

        model.addAttribute("order", order);
        model.addAttribute("document", document);
        return "documentManager";
    }

    @PostMapping("/order/detail-order/upload")
    public String uploadFile(
            @RequestParam("document")MultipartFile multipartFile,
            @ModelAttribute DocumentOrderModel document,
            @ModelAttribute OrderModel order,
            RedirectAttributes ra
    ) {
        String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
        //document.setIdOrder(order);
        document.setDocName(fileName);
        document.setSize(multipartFile.getSize());
        document.setUploadedDate(new Date());
        documentOrderDb.save(document);

        ra.addFlashAttribute("message", "The File Upload had been Successfully!");
        return "redirect:/";
    }
}
