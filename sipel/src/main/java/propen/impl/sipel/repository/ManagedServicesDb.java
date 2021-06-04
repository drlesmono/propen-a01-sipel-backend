package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.ManagedServicesModel;

import java.util.List;
import java.util.Optional;

@Repository
public interface ManagedServicesDb extends JpaRepository<ManagedServicesModel, Long> {

    Optional<ManagedServicesModel> findById(Long id);

    List<ManagedServicesModel> findByOrderByActualEnd();

}
