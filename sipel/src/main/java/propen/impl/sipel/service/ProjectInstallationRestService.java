package propen.impl.sipel.service;

import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ProjectInstallationModel;

import java.util.List;
import java.util.Date;

public interface ProjectInstallationRestService {

    List<ProjectInstallationModel> retrieveListPi();

    ProjectInstallationModel updatePIC(Long idOrderPi, String idUserEng);

    List<String> getListBulan(Date startDate, Date endDate);

    List<Integer> getPiMasuk(Date startDate, Date endDate);

    List<Integer> getPiSelesai(Date startDate, Date endDate);
}
