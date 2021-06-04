package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.ServicesModel;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServicesDb extends JpaRepository<ServicesModel,Long> {
    Optional<ServicesModel> findById(Long idServices);
    List<ServicesModel> findAllByIdOrderMS(Long idOrderMS);
}
