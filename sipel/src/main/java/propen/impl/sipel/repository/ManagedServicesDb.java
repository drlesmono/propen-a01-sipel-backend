package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.ManagedServicesModel;

import java.util.List;

@Repository
public interface ManagedServicesDb extends JpaRepository<ManagedServicesModel, Long>, PagingAndSortingRepository<ManagedServicesModel,Long> {
    List<ManagedServicesModel> findByOrderByActualEnd();
}
