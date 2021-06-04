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
    public TaskModel addTask(TaskModel task, Long idPi){
        task.setIdOrderPi(projectInstallationRestService.getProjectInstallationByIdOrderPi(idPi));
        return taskDb.save(task);
    }

}
