package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.InstallationReportModel;

@Repository
public interface InstallationReportDb extends JpaRepository<InstallationReportModel, Long> {
}
