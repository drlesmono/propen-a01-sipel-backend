package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.ReportModel;

import java.util.List;

@Repository
public interface ReportDb extends JpaRepository<ReportModel,Long>, PagingAndSortingRepository<ReportModel, Long> {
    List<ReportModel> findAllByOrderByUploadedDateDesc();

    ReportModel findByIdInstallationReport(Long idIr);

    ReportModel findByIdMaintenanceReport(Long idMr);

    ReportModel findByIdBast(Long idBast);

    ReportModel findByReportName(String reportName);
}
