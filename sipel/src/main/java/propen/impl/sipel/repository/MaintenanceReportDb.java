package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.MaintenanceReportModel;

@Repository
public interface MaintenanceReportDb extends JpaRepository<MaintenanceReportModel,Long> {
}
