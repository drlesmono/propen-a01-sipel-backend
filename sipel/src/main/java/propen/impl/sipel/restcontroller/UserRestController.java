package propen.impl.sipel.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import propen.impl.sipel.model.ERole;
import propen.impl.sipel.model.RoleModel;
import propen.impl.sipel.model.UserModel;
import propen.impl.sipel.repository.RoleDb;
import propen.impl.sipel.repository.UserDb;
import propen.impl.sipel.rest.BaseResponse;
import propen.impl.sipel.rest.UserDto;
import propen.impl.sipel.service.UserRestService;

import javax.validation.Valid;
import java.util.*;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/v1")
public class UserRestController {

    @Autowired
    private UserRestService userRestService;

    @Autowired
    UserDb userDb;

    @Autowired
    RoleDb roleDb;

    // Mengembalikan list user yang memiliki role engineer
    @GetMapping(value="/engineers")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserModel> retrieveListEngineer(){

        List<UserModel> users = userRestService.retrieveListUser();
        List<UserModel> EngineerUser = new ArrayList<>();
        for (UserModel user : users){
            Set<RoleModel> roles = user.getRoles();
            for (RoleModel role : roles){
                if (user.getRole_name().equals("Engineer")){
                    EngineerUser.add(user);
                }
            }
        }
        return EngineerUser;
    }

    @GetMapping(value="/all/users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<UserModel> retrieveListAllUser(){
        return userRestService.retrieveListUser();
    }

    @PutMapping(value="/user/updateRole")
    @PreAuthorize("hasRole('ADMIN')")
    public BaseResponse<UserModel> updateRole(@Valid @RequestBody UserDto user,
                                              BindingResult bindingResult){
        BaseResponse<UserModel> response = new BaseResponse<>();
        if(bindingResult.hasFieldErrors()){
            // Respon Gagal Simpan
            response.setMessage("Pembuatan order baru untuk perpanjangan kontrak gagal disimpan." );
            response.setStatus(405);
            return response;
        }
        UserModel oldUser = userDb.findByUsername(user.getUsername()).get();

        Set<RoleModel> roles = new HashSet<>();

        if (user.getRole_name().equals("None")) {
            RoleModel noneRole = roleDb.findByName(ERole.ROLE_NONE)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(noneRole);
        } else if (user.getRole_name().equals("Admin")) {
            RoleModel adminRole = roleDb.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(adminRole);
        } else if (user.getRole_name().equals("Finance")) {
            RoleModel financeRole = roleDb.findByName(ERole.ROLE_FINANCE)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(financeRole);
        } else if (user.getRole_name().equals("Manager")) {
            RoleModel managerRole = roleDb.findByName(ERole.ROLE_MANAGER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(managerRole);
        } else if (user.getRole_name().equals("Engineer")) {
            RoleModel engineerRole = roleDb.findByName(ERole.ROLE_ENGINEER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(engineerRole);
        } else {
            RoleModel dataEntryRole = roleDb.findByName(ERole.ROLE_DATA_ENTRY)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(dataEntryRole);
        }

        oldUser.setRole_name(user.getRole_name());
        oldUser.setRoles(roles);
        userDb.save(oldUser);
        response.setStatus(200);
        response.setMessage("Success");
        response.setResult(oldUser);

        return response;
    }

    @DeleteMapping("/delete-user/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> deleteUser(@PathVariable String username){
        UserModel user = userDb.findByUsername(username).get();
        userDb.delete(user);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}