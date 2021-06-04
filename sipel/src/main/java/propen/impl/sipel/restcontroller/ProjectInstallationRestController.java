package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.ProjectInstallationDto;
import propen.impl.sipel.service.ProjectInstallationRestService;

import javax.validation.Valid;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class ProjectInstallationRestController {

    @Autowired
    private ProjectInstallationRestService projectInstallationRestService;

    // Mengembalikan list seluruh order jenis project installation
    @GetMapping(value="/orders/pi")
    private List<ProjectInstallationModel> retrieveListPi(){
        return projectInstallationRestService.retrieveListPi();
    }

    // Mengubah pic engineer dari suatu project installation
    // Mengembalikan response dengan result project installation yang berhasil menyimpan pic engineer
    @PutMapping(value="/order/{idOrder}/pi/{idOrderPi}/updatePIC")
    private BaseResponse<ProjectInstallationModel> updatePIC(@Valid @RequestBody ProjectInstallationDto pi,
                                                             BindingResult bindingResult){
        BaseResponse<ProjectInstallationModel> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("PIC Engineer pada Project Installation gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        ProjectInstallationModel newPi = projectInstallationRestService.updatePIC(pi.getIdOrderPi(), pi.getIdUserEng());
        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(newPi);

        return response;
    }

    @GetMapping(value="/orders/pi/namaBulan/{startDateString}/{endDateString}")
    private List<String> retrieveListNamaBulanPi(@PathVariable("startDateString") String startDateString, @PathVariable("endDateString") String endDateString){
        String[] buatMisahinStart = startDateString.split("_");
        String[] buatMisahinEnd = endDateString.split("_");

        int startMonth = Integer.parseInt(buatMisahinStart[0]);
        int startYear = Integer.parseInt(buatMisahinStart[1]);

        int endMonth = Integer.parseInt(buatMisahinEnd[0]);
        int endYear = Integer.parseInt(buatMisahinEnd[1]);

        Date startDate = java.util.Date.from(
                LocalDate.of(startYear, startMonth, 01).atStartOfDay(ZoneId.of("Africa/Tunis")).toInstant()
        );

        Date endDate = java.util.Date.from(
                LocalDate.of(endYear, endMonth, 30).atStartOfDay(ZoneId.of("Africa/Tunis")).toInstant()
        );
        System.out.println("masuk ke controller pi bulan");
        System.out.println(startDate);
        System.out.println(endDate);
        return projectInstallationRestService.getListBulanPi(startDate, endDate);
    }

    @GetMapping(value="/orders/pi/masuk/{startDateString}/{endDateString}")
    private List<Integer> retrieveListJumlahPiMasukPerBulan(@PathVariable("startDateString") String startDateString, @PathVariable("endDateString") String endDateString){
        String[] buatMisahinStart = startDateString.split("_");
        String[] buatMisahinEnd = endDateString.split("_");

        int startMonth = Integer.parseInt(buatMisahinStart[0]);
        int startYear = Integer.parseInt(buatMisahinStart[1]);

        int endMonth = Integer.parseInt(buatMisahinEnd[0]);
        int endYear = Integer.parseInt(buatMisahinEnd[1]);

        Date startDate = java.util.Date.from(
                LocalDate.of(startYear, startMonth, 01).atStartOfDay(ZoneId.of("Africa/Tunis")).toInstant()
        );

        Date endDate = java.util.Date.from(
                LocalDate.of(endYear, endMonth, 30).atStartOfDay(ZoneId.of("Africa/Tunis")).toInstant()
        );
        System.out.println("masuk ke controller pi masuk");
        System.out.println(startDate);
        System.out.println(endDate);
        return projectInstallationRestService.getPiMasuk(startDate, endDate);
    }

    @GetMapping(value="/orders/pi/selesai/{startDateString}/{endDateString}")
    private List<Integer> retrieveListJumlahPiSelesaiPerBulan(@PathVariable("startDateString") String startDateString, @PathVariable("endDateString") String endDateString){
        String[] buatMisahinStart = startDateString.split("_");
        String[] buatMisahinEnd = endDateString.split("_");

        int startMonth = Integer.parseInt(buatMisahinStart[0]);
        int startYear = Integer.parseInt(buatMisahinStart[1]);

        int endMonth = Integer.parseInt(buatMisahinEnd[0]);
        int endYear = Integer.parseInt(buatMisahinEnd[1]);

        Date startDate = java.util.Date.from(
                LocalDate.of(startYear, startMonth, 01).atStartOfDay(ZoneId.of("Africa/Tunis")).toInstant()
        );

        Date endDate = java.util.Date.from(
                LocalDate.of(endYear, endMonth, 30).atStartOfDay(ZoneId.of("Africa/Tunis")).toInstant()
        );
        System.out.println("masuk ke controller pi selesai");
        System.out.println(startDate);
        System.out.println(endDate);
        return projectInstallationRestService.getPiSelesai(startDate, endDate);
    }

}
