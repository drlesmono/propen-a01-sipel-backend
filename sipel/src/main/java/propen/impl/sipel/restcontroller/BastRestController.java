package propen.impl.sipel.restcontroller;

import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import propen.impl.sipel.model.*;
import propen.impl.sipel.rest.*;
import propen.impl.sipel.service.BastService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static java.util.Collections.reverse;
import org.springframework.security.access.prepost.PreAuthorize;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
public class BastRestController {

    @Qualifier("bastServiceImpl")
    @Autowired
    private BastService bastService;

    // used to retrieve all report from backend
    @GetMapping(value = "/laporan")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('FINANCE')")
    public List<ReportDto> showAllLaporan(Model model){
        List<ReportModel> reportList = bastService.getAllReport();
        List<ReportDto> dtoList = new ArrayList<>();
        reverse(reportList);
        for(int i=0; i<reportList.size(); i++){
            ReportModel report = reportList.get(i);
            ReportDto dto = new ReportDto();
            dto.setIdReport(report.getIdReport());
            dto.setSigned(report.getSigned());
            dto.setStatusApproval(report.getStatusApproval());
            dto.setReportName(report.getReportName());
            dto.setReportType(report.getReportType());
            dto.setUploadedDate(report.getUploadedDate().toString());
            dtoList.add(dto);
        }
        return dtoList;
    }

    // used to retrieve all order from backend
    @GetMapping(value = "/laporan/order")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<OrderDto> showAllOrder(Model model){
        List<OrderModel> orderList = bastService.getOrderList();
        List<OrderDto> dtoList = new ArrayList<>();
        for(int i = 0; i<orderList.size(); i++){
            OrderModel order = orderList.get(i);
            OrderDto dto = new OrderDto();
            dto.setIdOrder(order.getIdOrder());
            dto.setClientName(order.getClientName());

            dto.setClientEmail(order.getClientEmail());
            dto.setClientOrg(order.getClientOrg());
            dto.setClientPIC(order.getClientPIC());
            dto.setDateOrder(order.getDateOrder().toString());
            dto.setDescription(order.getDescription());
            dto.setManagedService(order.getManagedService());
            dto.setProjectInstallation(order.getProjectInstallation());
            dto.setIsVerified(order.getVerified());
            dto.setOrderName(order.getOrderName());

            String test = null;
            Boolean validator = false;
            test = order.getClientDiv();
            if(test != null){
                dto.setClientDiv(order.getClientDiv()); }

            test = order.getClientPhone();
            if(test != null){
                dto.setClientPhone(order.getClientPhone()); }

            validator= order.getManagedService();
            if(validator == true){
                dto.setIdOrderMs(order.getIdOrderMs().getIdOrderMs()); }

            validator= order.getProjectInstallation();
            if(validator == true){
                dto.setIdOrderPi(order.getIdOrderPi().getIdOrderPi()); }

            test = order.getNoPO();
            if(test != null){
                dto.setNoPO(order.getNoPO()); }

            test = order.getNoSPH();
            if(test != null){
                dto.setClientPhone(order.getClientPhone()); }

            dtoList.add(dto);
        }

        return dtoList;
    }

    // used to retrieve all bast from backend
    @GetMapping(value = "/laporan/bast")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('FINANCE')")
    public List<BastDto> showAllBast(Model model){
        List<BastModel> bastList = bastService.getBastList();
        List<BastDto> dtoList = new ArrayList<>();
        for(int i = 0; i < bastList.size(); i++){
            BastModel bast = bastList.get(i);
            BastDto dto = new BastDto();
            dto.setIdBast(bast.getIdBast());
            dto.setBastNum(bast.getBastNum());
            dto.setDateHandover(bast.getDateHandover());
            dto.setIdReport(bast.getIdReport().getIdReport());
            ProjectInstallationModel pi = bast.getIdOrderPi();
            MaintenanceModel mn = bast.getIdMaintenance();
            if(pi == null){
                dto.setIdMaintenance(mn.getIdMaintenance());
                dto.setIdOrderMs(mn.getIdOrderMS().getIdOrderMs());
                dto.setPicName(mn.getIdOrderMS().getIdUserPic().getFullname());
                dto.setStartPeriod(bast.getStartPeriod());
                dto.setEndPeriod(bast.getEndPeriod());
            }
            if(mn == null){
                dto.setIdOrderPi(pi.getIdOrderPi());
                UserModel pieng = pi.getIdUserEng();
                if(pieng == null){
                    dto.setPicName("------");
                }
                else{
                    dto.setPicName(pieng.getFullname());
                }


            }
            dtoList.add(dto);
        }
        return dtoList;
    }

    // used to retrieve all installation project from backend
    // used
    @GetMapping(value = "/laporan/pi")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<ProjectInstallationModel> showAllPi(Model model){
        List<ProjectInstallationModel> piList = bastService.getPiList("create");
        return piList;
    }

    // used to retrieve all maintenance from backend
    // used
    @GetMapping(value = "/laporan/mn")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<MaintenanceModel> showAllMn(Model model){
        List<MaintenanceModel> mnList = bastService.getMaintenanceList("create");
        return mnList;
    }

    @GetMapping(value = "/laporan/mn/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<MaintenanceModel> showAllMns(Model model){
        List<MaintenanceModel> mnList = bastService.getMaintenanceList("all");
        return mnList;
    }

    // used as a page of option
    @GetMapping(value = "/laporan/bast/create")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public String showBastOption(){
        return "bast-option";
    }

    // Halaman form add bast pi
    @GetMapping(value = "/laporan/bast/create/pi")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public LinkedHashMap<String, Object> addBastPiFormPage(Model model){
        List<ProjectInstallationModel> projectInstallationList = bastService.getPiList("create");
        ReportModel report = new ReportModel();
        BastModel bastPi = new BastModel();

        LinkedHashMap<String, Object> mapBastPi =new LinkedHashMap<String, Object>();
        mapBastPi.put("projectInstallationList", projectInstallationList);
        mapBastPi.put("report", report );
        mapBastPi.put("bastPi", bastPi);

        return mapBastPi;
    }

    // Halaman form add bast pi
    @GetMapping(value = "/laporan/bast/create/mn")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public LinkedHashMap<String, Object> addBastMnFormPage(Model model){
        List<MaintenanceModel> maintenanceList = bastService.getMaintenanceList("create");
        ReportModel report = new ReportModel();
        BastModel bastMn = new BastModel();

        LinkedHashMap<String, Object> mapBastMn =new LinkedHashMap<String, Object>();
        mapBastMn.put("maintenanceList", maintenanceList);
        mapBastMn.put("report", report );
        mapBastMn.put("bastMn", bastMn);

        return mapBastMn;
    }


    @PostMapping(value = "/laporan/create-bast/pi")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public BaseResponse<BastDto> addBastPiSubmit(@Valid @RequestBody BastDto bastDto,
                                                 BindingResult bindingResult) throws ParseException {
        BaseResponse<BastDto> response = new BaseResponse<>();

        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage(bindingResult.getAllErrors().toString());
            response.setStatus(405);
            return response;
        }
        response.setStatus(200);
        response.setMessage("Success");

        ReportModel report = bastService.createReport("pi");

        BastModel bast = new BastModel();
        Long id = bastDto.getIdOrderPi();
        bast.setIdOrderPi(bastService.getPi(id));
        bast.setDateHandover(bastDto.getDateHandover());
        String bastNum = bastService.createBastNum(bast);
        bast.setBastNum(bastNum);
        bast.setIdReport(report);
        bastService.addBast(bast);

        BastModel currentBast = bastService.getBastByNum(bastNum);

        bastDto.setBastNum(bastNum);
        bastDto.setIdBast(currentBast.getIdBast());
        bastDto.setIdReport(currentBast.getIdReport().getIdReport());
        //bastDto.setIdOrderPi(currentBast.getIdOrderPi());

        response.setResult(bastDto);
        return response;
    }

    @PostMapping(value = "/laporan/create-bast/mn")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public BaseResponse<BastDto> addBastMnSubmit(@Valid @RequestBody BastDto bastDto,
                                                 BindingResult bindingResult) throws ParseException {
        BaseResponse<BastDto> response = new BaseResponse<>();

        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage(bindingResult.getAllErrors().toString());
            response.setStatus(405);
            return response;
        }
        response.setStatus(200);
        response.setMessage("Success");

        ReportModel report = bastService.createReport("mn");

        BastModel bast = new BastModel();
        Long id = bastDto.getIdMaintenance();

        bast.setIdMaintenance(bastService.getMn(id));
        bast.setDateHandover(bastDto.getDateHandover());
        bast.setStartPeriod(bastDto.getStartPeriod());
        bast.setEndPeriod(bastDto.getEndPeriod());
        String bastNum = bastService.createBastNum(bast);
        bast.setBastNum(bastNum);
        bast.setIdReport(report);
        bastService.addBast(bast);

        BastModel currentBast = bastService.getBastByNum(bastNum);
        bastService.changeReportName(currentBast);
        //OrderModel order = bastService.getOrderFromBast(currentBast);
        //UserModel engineer = order.getIdOrderPi().getIdUserEng();

        bastDto.setBastNum(bastNum);
        bastDto.setIdBast(currentBast.getIdBast());
        bastDto.setIdReport(currentBast.getIdReport().getIdReport());
        //bastDto.setIdOrderPi(currentBast.getIdOrderPi());

        response.setResult(bastDto);
        return response;
    }

    @GetMapping(value = "/laporan/bast/{idBast}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('FINANCE')")
    public LinkedHashMap<String, Object> findBastByNum(@PathVariable(value = "idBast") Long idBast){
        try{
            BastModel currentBast = bastService.getBastById(idBast);
            OrderModel order = bastService.getOrderFromBast(currentBast);

            UserModel engineer = null;
            String reportName = currentBast.getIdReport().getReportName();
            if(reportName.split("/")[1] == "MN"){
                engineer = order.getIdOrderMs().getIdUserPic();
            }
            // if(reportName.split("/")[1] == "PI")
            else {
                engineer = order.getIdOrderPi().getIdUserEng();
            }

            LinkedHashMap<String, Object> mapBast=new LinkedHashMap<String, Object>();
            mapBast.put("bast", currentBast);
            mapBast.put("order", order);
            mapBast.put("engineer", engineer);

            return mapBast;

        }catch(NoSuchElementException e){
            throw  new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "BAST dengan nomor permintaan "+ String.valueOf(idBast) + " tidak ditemukan!"
            );
        }
    }

    @PutMapping({"/laporan/accept/{idReport}"})
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public BaseResponse<ReportDto> acceptBast(@Valid @RequestBody ReportDto report,
                                               BindingResult bindingResult){
        BaseResponse<ReportDto> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("Status gagal diubah" );
            response.setStatus(405);
            return response;
        }
        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(report);
        bastService.approveBastFromLaporan(report.getIdReport());
        return response;
    }

    @PutMapping({"/laporan/reject/{idReport}"})
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public BaseResponse<ReportDto> rejectBast(@Valid @RequestBody ReportDto report,
                                               BindingResult bindingResult){
        BaseResponse<ReportDto> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("Status gagal diubah" );
            response.setStatus(405);
            return response;
        }
        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(report);
        bastService.rejectBastFromLaporan(report.getIdReport());
        return response;
    }



    @Bean
    public RestTemplate getRestTemplate(){
        return new RestTemplate();
    }

}
