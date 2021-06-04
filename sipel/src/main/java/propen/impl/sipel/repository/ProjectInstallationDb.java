package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ProjectInstallationModel;

import java.util.Optional;

@Repository
public interface ProjectInstallationDb extends JpaRepository<ProjectInstallationModel, Long> {
    Optional<ProjectInstallationModel> findById(Long idOrder);
    ProjectInstallationModel findByIdOrderPi(Long idOrderPi);
}
