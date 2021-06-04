package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.TaskModel;
import propen.impl.sipel.repository.TaskDb;
import propen.impl.sipel.service.ProjectInstallationRestService;
import propen.impl.sipel.service.TaskRestService;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
public class TaskRestController {

    @Autowired
    TaskRestService taskRestService;

    @Autowired
    TaskDb taskDb;

    @Autowired
    ProjectInstallationRestService projectInstallationRestService;

    @PostMapping("/list-task/{idOrderPi}")
    @PreAuthorize("hasRole('ENGINEER')")
    public TaskModel createTask(@PathVariable Long idOrderPi, @RequestBody TaskModel task){
        //return taskRestService.addTask(task, idOrderPi);
        task.setIdOrderPi(projectInstallationRestService.getProjectInstallationByIdOrderPi(idOrderPi));
        Float persen = (float) 0;
        task.setPercentage(persen);
        TaskModel taskss = taskDb.save(task);
        return taskss;
    }

    @GetMapping(value="/retrieve-task/{idTask}")
    @PreAuthorize("hasRole('ENGINEER')")
    public TaskModel getTaskByIdTask(@PathVariable Long idTask, Model model){
        TaskModel task = taskDb.findByIdTask(idTask);//.orElseThrow(( -> new ResourceNotFoundException("Task not exist wth id :" + idTask)));
        //return taskDb.findByIdTask(idTask);
        return task;
    }

    @PutMapping("list-task/{idTask}")
    @PreAuthorize("hasRole('ENGINEER')")
    public TaskModel updateTaskModel(@PathVariable Long idTask, @RequestBody TaskModel task){
        TaskModel targetedTask = taskDb.findByIdTask(idTask);//.orElseThrow(( -> new ResourceNotFoundException("Task not exist wth id :" + idTask)));

        if(task.getPercentage()==null){
            targetedTask.setTaskName(task.getTaskName());
            targetedTask.setDescription(task.getDescription());
        } else {
            targetedTask.setPercentage(task.getPercentage());
        }

        TaskModel updatedTask = taskDb.save(targetedTask);
        return updatedTask;
    }

    @DeleteMapping("/list-task/{idTask}")
    @PreAuthorize("hasRole('ENGINEER')")
    public ResponseEntity<Map<String, Boolean>> deleteTask(@PathVariable Long idTask){
        TaskModel task = taskDb.findByIdTask(idTask);
        taskDb.delete(task);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

}
