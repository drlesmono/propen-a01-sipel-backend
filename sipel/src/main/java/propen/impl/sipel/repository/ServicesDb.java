package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.ServicesModel;

@Repository
public interface ServicesDb extends JpaRepository<ServicesModel,Long> {
}
