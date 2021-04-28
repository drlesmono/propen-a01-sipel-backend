package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.ProjectInstallationModel;

@Repository
public interface ProjectInstallationDb extends JpaRepository<ProjectInstallationModel, Long> {
    ProjectInstallationModel findByIdOrderPi(Long idOrderPi);
}
