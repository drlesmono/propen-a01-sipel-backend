package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.ManagedServicesModel;

@Repository
public interface ManagedServicesDb extends JpaRepository<ManagedServicesModel,Long> {
}
