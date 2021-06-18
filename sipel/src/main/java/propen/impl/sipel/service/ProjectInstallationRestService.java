package propen.impl.sipel.service;

import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.model.TaskModel;

import java.util.List;
import java.util.Date;

public interface ProjectInstallationRestService {
    ProjectInstallationModel createOrderPI(ProjectInstallationModel projectInstallation);

    ProjectInstallationModel changeOrderPI(Long idOrderPi, ProjectInstallationModel orderPIUpdate);

    ProjectInstallationModel getPIOrderById(Long idOrderPI);

//    List<ProjectInstallationModel> retrievePI();

    List<ProjectInstallationModel> retrieveListPi();

    ProjectInstallationModel updatePIC(Long idOrderPi, String idUserEng);

    List<ProjectInstallationModel> getListVerifiedPi();

    ProjectInstallationModel getProjectInstallationByIdOrderPi(Long idOrderPi);

    List<String> getListBulanPi(Date startDate, Date endDate);

    List<Integer> getPiMasuk(Date startDate, Date endDate);

    List<Integer> getPiSelesai(Date startDate, Date endDate);

    List<Integer> getPiTepatWaktuTelat(Date startDate, Date endDate);

    Integer getPiBelumSelesai();

    ProjectInstallationModel updateStatus(Long idOrderPi, String status);

    void updateTask();
}
