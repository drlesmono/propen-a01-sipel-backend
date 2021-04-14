package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.RoleModel;

@Repository
public interface RoleDb extends JpaRepository<RoleModel,Long> {
}
