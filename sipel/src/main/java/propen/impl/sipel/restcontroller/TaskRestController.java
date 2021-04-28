package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import propen.impl.sipel.exception.ResourceNotFoundException;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.model.TaskModel;
import propen.impl.sipel.repository.ProjectInstallationDb;
import propen.impl.sipel.repository.TaskDb;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.ProjectInstallationDto;
import propen.impl.sipel.service.ProjectInstallationRestService;
import propen.impl.sipel.service.TaskRestService;

import javax.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1")
public class TaskRestController {

    @Autowired
    TaskRestService taskRestService;

    @Autowired
    TaskDb taskDb;

    @Autowired
    ProjectInstallationRestService projectInstallationRestService;

    @PostMapping("/list-task/{idOrderPi}")
    private TaskModel createTask(@PathVariable(value="idOrderPi") Long idOrderPi, @RequestBody TaskModel task){
        //return taskRestService.addTask(task, idOrderPi);
        task.setIdOrderPi(projectInstallationRestService.getProjectInstallationByIdOrderPi(idOrderPi));
        task.setPercentage(0);
        return taskDb.save(task);
    }

    @GetMapping(value="/retrieve-task/{idTask}")
    private TaskModel getTaskByIdTask(@PathVariable Long idTask, Model model){
        TaskModel task = taskDb.findByIdTask(idTask);//.orElseThrow(( -> new ResourceNotFoundException("Task not exist wth id :" + idTask)));
        //return taskDb.findByIdTask(idTask);
        return task;
    }

    @PutMapping("list-task/{idTask}")
    public TaskModel updateTaskModel(@PathVariable Long idTask, @RequestBody TaskModel task){
        TaskModel targetedTask = taskDb.findByIdTask(idTask);//.orElseThrow(( -> new ResourceNotFoundException("Task not exist wth id :" + idTask)));
        
        if(task.getPercentage()==null){
            targetedTask.setTaskName(task.getTaskName());
            targetedTask.setDescription(task.getDescription());
        } else {
            targetedTask.setPercentage(task.getPercentage());
        }
        
        TaskModel updatedTask = taskDb.save(targetedTask);
        return updatedTask; //ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/list-task/{idTask}")
    public ResponseEntity<Map<String, Boolean>> deleteTask(@PathVariable Long idTask){
        TaskModel task = taskDb.findByIdTask(idTask);
        taskDb.delete(task);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
    
}
