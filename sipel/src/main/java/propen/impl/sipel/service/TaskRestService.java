package propen.impl.sipel.service;
import propen.impl.sipel.model.TaskModel;

public interface TaskRestService {

    TaskModel addTask(TaskModel task);

    TaskModel updateTask(Long idTask, TaskModel task);

    void deleteTask(Long idTask);

    TaskModel findTaskById(Long idTask);
}
