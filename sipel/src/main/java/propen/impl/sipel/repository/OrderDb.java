package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.OrderModel;

import java.util.Optional;

@Repository
public interface OrderDb extends JpaRepository<OrderModel,Long> {
    Optional<OrderModel> findById(Long idOrder);
}
