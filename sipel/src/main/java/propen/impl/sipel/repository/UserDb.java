package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.UserModel;

@Repository
public interface UserDb extends JpaRepository<UserModel,Long> {
}
