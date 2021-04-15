package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.MaintenanceModel;

@Repository
public interface MaintenanceDb extends JpaRepository<MaintenanceModel, Long> {
}
