package propen.impl.sipel.service;

import propen.impl.sipel.model.*;

import java.text.ParseException;
import java.util.List;

public interface BastService {

    void addBast(BastModel bastModel);
    void changeReportName(BastModel bastModel);

    List<BastModel> getBastList();

    BastModel getBastById(Long idBast);

    ReportModel createReportModel(ReportModel reportModel);
    ReportModel createReport(String type) throws ParseException;

    String createBastNum(BastModel bastModel);

    Long getIdOrder(BastModel bastModel);

    List<OrderModel> getOrderList();

    List<MaintenanceModel> getMaintenanceList(String keyword);

    List<ProjectInstallationModel> getPiList(String keyword);

    ProjectInstallationModel getPi(Long idOrderPi);

    MaintenanceModel getMn(Long idMaintenance);

    List<ManagedServicesModel> getMSList();

    BastModel getBastByNum(String bastNum);

    OrderModel getOrderFromBast(BastModel bastModel);

    BastModel approveBast(BastModel bastModel);

    ReportModel approveBastFromLaporan(Long idReport);
    ReportModel rejectBastFromLaporan(Long idReport);

    BastModel rejectBast(BastModel bastModel);

    List<ReportModel> getAllReport();

    ReportModel getReportByBast(BastModel bastModel);
}
