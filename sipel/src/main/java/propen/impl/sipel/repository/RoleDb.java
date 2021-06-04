package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.ERole;
import propen.impl.sipel.model.RoleModel;

import java.util.Optional;

@Repository
public interface RoleDb extends JpaRepository<RoleModel,Long> {
    Optional<RoleModel> findByName(ERole name);
}
