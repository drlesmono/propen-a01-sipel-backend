package propen.impl.sipel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "role")
public class RoleModel implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**@OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private List<UserModel> userRole;*/

    //kamila nambahin
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole name;

    public RoleModel() {

    }

    public RoleModel(ERole name) {
        this.name = name;
    }

    public ERole getName() {
        return name;
    }

    public void setName(ERole name) {
        this.name = name;
    }


    public void setId(Long id) {
        this.id = id;
    }

    //kamila nambahin sampai sini

    public Long getId() {
        return id;
    }

    /**public void setRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }*/

    /**public void setUserRole(List<UserModel> userRole) {
        this.userRole = userRole;
    }

    public List<UserModel> getUserRole() {
        return userRole;
    }*/
}


