package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.UserModel;

import java.util.Optional;

@Repository
public interface UserDb extends JpaRepository<UserModel,String> {
    Optional<UserModel> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}
