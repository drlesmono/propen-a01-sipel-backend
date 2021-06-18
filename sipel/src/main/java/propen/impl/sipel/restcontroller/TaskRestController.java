package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.TaskModel;
import propen.impl.sipel.repository.TaskDb;
import propen.impl.sipel.repository.ProjectInstallationDb;
import propen.impl.sipel.service.ProjectInstallationRestService;
import propen.impl.sipel.service.TaskRestService;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import propen.impl.sipel.model.ProjectInstallationModel;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
public class TaskRestController {

    @Autowired
    TaskRestService taskRestService;

    @Autowired
    ProjectInstallationRestService projectInstallationRestService;

    @PostMapping("/list-task/{idOrderPi}")
    @PreAuthorize("hasRole('ENGINEER')")
    public TaskModel createTask(@PathVariable Long idOrderPi, @RequestBody TaskModel task){
        task.setIdOrderPi(projectInstallationRestService.getProjectInstallationByIdOrderPi(idOrderPi));
        return taskRestService.addTask(task);
    }

    @GetMapping(value="/retrieve-task/{idTask}")
    @PreAuthorize("hasRole('ENGINEER')")
    public TaskModel getTaskByIdTask(@PathVariable Long idTask, Model model){
        return taskRestService.findTaskById(idTask);
    }

    @PutMapping("list-task/{idTask}")
    @PreAuthorize("hasRole('ENGINEER')")
    public TaskModel updateTaskModel(@PathVariable Long idTask, @RequestBody TaskModel task){
        TaskModel updatedTask = taskRestService.updateTask(idTask, task);

        projectInstallationRestService.updateTask();

        return updatedTask;
    }

    @DeleteMapping("/list-task/{idTask}")
    @PreAuthorize("hasRole('ENGINEER')")
    public ResponseEntity<Map<String, Boolean>> deleteTask(@PathVariable Long idTask){
        taskRestService.deleteTask(idTask);

        projectInstallationRestService.updateTask();

        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

}
