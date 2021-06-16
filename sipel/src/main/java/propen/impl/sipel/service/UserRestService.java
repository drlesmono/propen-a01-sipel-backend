package propen.impl.sipel.service;

import propen.impl.sipel.model.UserModel;
import propen.impl.sipel.rest.UserDto;

import java.util.List;

public interface UserRestService {

    List<UserModel> retrieveListUser();

    UserModel updateRole(UserDto user);

}
