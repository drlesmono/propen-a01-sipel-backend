package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import propen.impl.sipel.model.UserModel;
import propen.impl.sipel.service.UserRestService;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/v1")
public class UserRestController {

    @Autowired
    private UserRestService userRestService;

    @GetMapping(value="/users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<UserModel> retrieveListUser(){
        return userRestService.retrieveListUser();
    }
}
