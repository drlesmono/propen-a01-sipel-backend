package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.TaskModel;

@Repository
public interface TaskDb extends JpaRepository<TaskModel,Long> {
    TaskModel findByIdTask(Long idTask);
}
