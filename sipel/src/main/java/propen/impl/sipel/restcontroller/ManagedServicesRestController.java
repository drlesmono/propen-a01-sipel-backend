package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.ManagedServicesDto;
import propen.impl.sipel.service.ManagedServicesRestService;
import propen.impl.sipel.service.OrderRestService;

import javax.validation.Valid;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class ManagedServicesRestController {

    @Autowired
    private ManagedServicesRestService managedServicesRestService;

    @Autowired
    private OrderRestService orderRestService;

    // Mengembalikan list seluruh order jenis managed services
    @GetMapping(value="/orders/ms")
    private List<ManagedServicesModel> retrieveListMs(){
        return managedServicesRestService.retrieveListMs();
    }

    // Mengubah pic engineer dari suatu managed services
    // Mengembalikan response dengan result managed services yang berhasil menyimpan pic engineer
    @PutMapping(value="/order/{idOrder}/ms/{idOrderMs}/updatePIC")
    private BaseResponse<ManagedServicesModel> updatePIC(@Valid @RequestBody ManagedServicesDto ms,
                                                         BindingResult bindingResult){
        BaseResponse<ManagedServicesModel> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("PIC Engineer pada Managed Service gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        ManagedServicesModel newMs = managedServicesRestService.updatePIC(ms.getIdOrderMs(), ms.getIdUserPic());
        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(newMs);

        return response;
    }

    // Mengubah periode kontrak dari suatu managed services
    // Mengembalikan response dengan result managed services yang berhasil menyimpan periode kontrak
    @PutMapping(value="/order/{idOrder}/ms/updateKontrak")
    private BaseResponse<ManagedServicesModel> updateKontrak(@Valid @RequestBody ManagedServicesDto ms,
                                                             @PathVariable("idOrder") Long idOrder,
                                                             BindingResult bindingResult){
        BaseResponse<ManagedServicesModel> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("Periode kontrak pada Managed Service gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        OrderModel order = orderRestService.findOrderById(idOrder);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date actualStart = formatter.parse(ms.getActualStart());
            Date actualEnd = formatter.parse(ms.getActualEnd());
            ManagedServicesModel newMs = managedServicesRestService.updateKontrak(order.getIdOrderMs().getIdOrderMs(),
                                        ms.getIdUserPic(), actualStart, actualEnd);
            response.setStatus(200);
            response.setMessage("Success");
            response.setResult(newMs);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return response;
    }

    @GetMapping(value="/orders/ms/perc")
    private LinkedHashMap<String, String> retrieveTermMs(){

        return managedServicesRestService.retrievePercentageMs();
    }

    @GetMapping(value="/orders/ms/namaBulan/{startDateString}/{endDateString}")
    private List<String> retrieveListNamaBulanMs(@PathVariable("startDateString") String startDateString, @PathVariable("endDateString") String endDateString){
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
        System.out.println("masuk ke controller ms bulan");
        System.out.println(startDate);
        System.out.println(endDate);
        return managedServicesRestService.getListBulanMs(startDate, endDate);
    }

    @GetMapping(value="/orders/ms/masuk/{startDateString}/{endDateString}")
    private List<Integer> retrieveListJumlahMsMasukPerBulan(@PathVariable("startDateString") String startDateString, @PathVariable("endDateString") String endDateString){
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
        System.out.println("masuk ke controller ms masuk");
        System.out.println(startDate);
        System.out.println(endDate);
        return managedServicesRestService.getMsMasuk(startDate, endDate);
    }

    @GetMapping(value="/orders/ms/selesai/{startDateString}/{endDateString}")
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
        System.out.println("masuk ke controller ms selesai");
        System.out.println(startDate);
        System.out.println(endDate);
        return managedServicesRestService.getMsSelesai(startDate, endDate);
    }

    @GetMapping(value="/orders/ms/belumSelesai")
    private Integer retrieveListJumlahMsTepatWaktuTelat(){
        System.out.println("masuk ke controller pi selesai");
        return managedServicesRestService.getMsBelumSelesai();
    }
}
