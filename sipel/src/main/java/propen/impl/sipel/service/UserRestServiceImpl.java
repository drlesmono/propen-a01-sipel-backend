package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.UserModel;
import propen.impl.sipel.repository.UserDb;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class UserRestServiceImpl implements UserRestService{

    @Autowired
    private UserDb userDb;

    // Mencari seluruh user yang terdaftar pada sistem
    @Override
    public List<UserModel> retrieveListUser() {
        return userDb.findAll();
    }
}
