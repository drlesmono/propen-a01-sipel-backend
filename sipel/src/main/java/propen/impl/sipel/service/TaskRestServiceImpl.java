package propen.impl.sipel.service;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import propen.impl.sipel.model.TaskModel;
import propen.impl.sipel.repository.TaskDb;

@Service
@Transactional
public class TaskRestServiceImpl implements TaskRestService {
    
    @Autowired
    TaskDb taskDb;

    @Autowired
    ProjectInstallationRestService projectInstallationRestService;

    @Override
    public TaskModel addTask(TaskModel task){
        Float persen = (float) 0;
        task.setPercentage(persen);
        return taskDb.save(task);
    }

    @Override
    public TaskModel updateTask(Long idTask, TaskModel task) {
        TaskModel targetedTask = taskDb.findByIdTask(idTask);//.orElseThrow(( -> new ResourceNotFoundException("Task not exist wth id :" + idTask)));

        if(task.getPercentage()==null){
            targetedTask.setTaskName(task.getTaskName());
            targetedTask.setDescription(task.getDescription());
        } else {
            targetedTask.setPercentage(task.getPercentage());
        }

        return taskDb.save(targetedTask);
    }

    @Override
    public void deleteTask(Long idTask) {
        TaskModel task = taskDb.findByIdTask(idTask);
        taskDb.delete(task);
    }

    @Override
    public TaskModel findTaskById(Long idTask) {
        return taskDb.findById(idTask).get();
    }
}
