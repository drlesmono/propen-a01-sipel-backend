package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.BastModel;

@Repository
public interface BastDb extends JpaRepository<BastModel, Long> {

}
