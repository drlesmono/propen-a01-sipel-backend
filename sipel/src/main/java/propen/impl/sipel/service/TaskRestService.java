package propen.impl.sipel.service;
import propen.impl.sipel.model.TaskModel;

public interface TaskRestService {

    TaskModel addTask(TaskModel task, Long idOrderPi);
    
}
