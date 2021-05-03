package propen.impl.sipel.controller;

import org.apache.catalina.User;
import org.hibernate.criterion.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.*;
import propen.impl.sipel.service.BastService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.Null;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@Controller
public class BastController {

    @Qualifier("bastServiceImpl")
    @Autowired
    private BastService bastService;

    @GetMapping(value = "/")
    public String basicPage(Model model){
        return "home";
    }

    // Halaman show all BAST
    @GetMapping(value = "/laporan")
    public String showAllBast(Model model){
        List<BastModel> bastList = bastService.getBastList();
        model.addAttribute("bastList", bastList);
        return "bast-all";
    }

    @GetMapping(value = "/laporan/bast")
    public String showBastOption(){
        return "bast-option";
    }

    // Halaman form add bast pi
    @GetMapping(value = "/laporan/create-bast/pi")
    public String addBastPiFormPage(Model model){
        List<ProjectInstallationModel> projectInstallationList = bastService.getPiList("create");
        ReportModel report = new ReportModel();
        BastModel bastPi = new BastModel();

        model.addAttribute("report", report);
        model.addAttribute("bastPi", bastPi);
        model.addAttribute("projectInstallationList", projectInstallationList);
        return "form-add-bast-pi";
    }

    // Halaman form bast mn
    @GetMapping(value = "/laporan/create-bast/mn")
    public String addBastMnFormPage(Model model){
        List<MaintenanceModel> maintenanceList = bastService.getMaintenanceList("create");
        ReportModel report = new ReportModel();
        BastModel bastMn = new BastModel();

        model.addAttribute("report", report);
        model.addAttribute("bastMn", bastMn);
        model.addAttribute("maintenanceList", maintenanceList);
        return "form-add-bast-mn";
    }



    // Submit form bast pi
    @RequestMapping(value = "/laporan/create-bast/pi", method = RequestMethod.POST, params = {"submit"})
    public String addBastPiSubmit(@ModelAttribute BastModel bast,
                                  @ModelAttribute ReportModel report,
                                  HttpServletRequest request, ModelMap model) throws ParseException {
        LocalDate dateCurrent = LocalDate.now();
        String date = dateCurrent.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        String[] dateSplit = String.valueOf(date).split("-");

        String reportName = "BAST/PI/" + dateSplit[0]+"/"+dateSplit[1]+"/"+dateSplit[2];
        report.setReportName(reportName);
        report.setReportType("BAST");
        report.setSigned(false);
        report.setStatusApproval("Pending");
        report.setUploadedDate(new SimpleDateFormat("dd-MM-yyyy").parse(date));
        bastService.createReportModel(report);

        String bastNum = bastService.createBastNum(bast);
        bast.setBastNum(bastNum);
        bast.setIdReport(bastService.createReportModel(report));
        bastService.addBast(bast);

        BastModel currentBast = bastService.getBastByNum(bastNum);
        OrderModel order = bastService.getOrderFromBast(currentBast);
        UserModel engineer = order.getIdOrderPi().getIdUserEng();

        model.clear();
        model.addAttribute("bast", bast);
        model.addAttribute("order", order);
        model.addAttribute("engineer", engineer);

        return "preview-bast-pi";
    }

    // Submit form bast mn
    @RequestMapping(value = "/laporan/create-bast/mn", method = RequestMethod.POST, params = {"submit"})
    public String addBastMnSubmit(@ModelAttribute BastModel bast,
                                  @ModelAttribute ReportModel report,
                                  HttpServletRequest request, ModelMap model) throws ParseException {
        LocalDate dateCurrent = LocalDate.now();
        String date = dateCurrent.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        String[] dateSplit = String.valueOf(date).split("-");

        String reportName = "BAST/MN/" + dateSplit[0]+"/"+dateSplit[1]+"/"+dateSplit[2];
        report.setReportName(reportName);
        report.setReportType("BAST");
        report.setSigned(false);
        report.setStatusApproval("Pending");
        report.setUploadedDate(new SimpleDateFormat("dd-MM-yyyy").parse(date));
        bastService.createReportModel(report);

        String bastNum = bastService.createBastNum(bast);
        bast.setBastNum(bastNum);
        bast.setIdReport(bastService.createReportModel(report));
        bastService.addBast(bast);

        BastModel currentBast = bastService.getBastByNum(bastNum);
        OrderModel order = bastService.getOrderFromBast(currentBast);
        UserModel engineer = order.getIdOrderMs().getIdUserPic();

        model.clear();
        model.addAttribute("bast", bast);
        model.addAttribute("order", order);
        model.addAttribute("engineer", engineer);

        return "preview-bast-mn";
    }

    @GetMapping({"/laporan/bast/preview/{idBast}"})
    private String previewBast(@PathVariable(required = false) Long idBast,
                               Model model){
        BastModel bast = bastService.getBastById(idBast);
        OrderModel order = bastService.getOrderFromBast(bast);
        model.addAttribute("bast", bast);
        model.addAttribute("order", order);

        UserModel engineer = null;
        String reportName = bast.getIdReport().getReportName();
        if(reportName.split("/")[1] == "MN"){
            engineer = order.getIdOrderMs().getIdUserPic();
            model.addAttribute("engineer", engineer);
            return "preview-bast-mn";
        }
        // if(reportName.split("/")[1] == "PI")
        else {
            engineer = order.getIdOrderPi().getIdUserEng();
            model.addAttribute("engineer", engineer);
            return "preview-bast-pi";
        }
    }

    @GetMapping({"/laporan/bast/accept/{idBast}"})
    private String acceptBast(
            @PathVariable(required = false) Long idBast,
            Model model
    ) {
        BastModel bastModel = bastService.getBastById(idBast);
        if (idBast != null && bastModel != null) {
            BastModel bast = bastService.approveBast(bastModel);
            model.addAttribute("bast", bast);

            return "accept-bast";
        }
        model.addAttribute("msg", "");
        return "error/404";
    }

    @GetMapping({"/laporan/bast/reject/{idBast}"})
    private String rejectBast(
            @PathVariable(required = false) Long idBast,
            Model model
    ) {
        BastModel bastModel = bastService.getBastById(idBast);
        if (idBast != null && bastModel != null) {
            BastModel bast = bastService.rejectBast(bastModel);
            model.addAttribute("bast", bast);

            return "reject-bast";
        }
        model.addAttribute("msg", "");
        return "error/404";
    }

}
