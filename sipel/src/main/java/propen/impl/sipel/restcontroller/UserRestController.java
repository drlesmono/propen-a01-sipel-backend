package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import propen.impl.sipel.model.UserModel;
import propen.impl.sipel.service.UserRestService;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class UserRestController {

    @Autowired
    private UserRestService userRestService;

    @GetMapping(value="/engineers")
    private List<UserModel> retrieveListEngineer(){
        List<UserModel> listUser = userRestService.retrieveListUser();
        List<UserModel> listEngineer = new ArrayList<>();

        for(UserModel user : listUser){
            if(user.getRole().getRole().equals("engineer")){
                listEngineer.add(user);
            }
        }

        return listEngineer;
    }
}