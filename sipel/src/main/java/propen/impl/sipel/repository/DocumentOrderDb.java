package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.DocumentOrderModel;

@Repository
public interface DocumentOrderDb extends JpaRepository<DocumentOrderModel,Long> {
}
