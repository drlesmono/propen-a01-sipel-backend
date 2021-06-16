package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.ERole;
import propen.impl.sipel.model.RoleModel;
import propen.impl.sipel.model.UserModel;
import propen.impl.sipel.repository.RoleDb;
import propen.impl.sipel.repository.UserDb;
import propen.impl.sipel.rest.UserDto;

import javax.transaction.Transactional;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class UserRestServiceImpl implements UserRestService{

    @Autowired
    private UserDb userDb;

    @Autowired
    private RoleDb roleDb;

    // Mencari seluruh user yang terdaftar pada sistem
    @Override
    public List<UserModel> retrieveListUser() {
        return userDb.findAll();
    }

    @Override
    public UserModel updateRole(UserDto user) {
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
        return userDb.save(oldUser);
    }
}
