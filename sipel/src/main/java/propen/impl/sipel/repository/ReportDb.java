package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.ReportModel;

@Repository
public interface ReportDb extends JpaRepository<ReportModel,Long> {
}
