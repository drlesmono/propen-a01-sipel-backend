package propen.impl.sipel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import java.io.Serializable;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "pengguna",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        })
public class UserModel implements Serializable {
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    private String id;

    @NotNull
    @Size(max = 20)
    @Column(name="username", nullable = false)
    private String username;

    @NotNull
    @Lob
    @Column(name="password", nullable = false)
    private String password;

    @NotNull
    @Column(name="nip", nullable = false)
    private String nip;

    @NotNull
    @Column(name="fullname", nullable = false)
    private String fullname;

    @NotNull
    @Size(max = 50)
    @Column(name="surname", nullable = false)
    private String surname;

    @NotNull
    @Column(name="email", nullable = false)
    private String email;

    @Column(name="role_name", nullable = true)
    private String role_name;

    public String getRole_name() {
        return role_name;
    }

    public void setRole_name(String role_name) {
        this.role_name = role_name;
    }

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(	name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<RoleModel> roles = new HashSet<>();

    public UserModel() {
    }

    public UserModel(String fullname, String surname, String email, String nip, String username, String role_name, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role_name = role_name;
        this.nip = nip;
        this.fullname = fullname;
        this.surname = surname;
    }

    @OneToMany(mappedBy = "idUserEng", fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private List<ProjectInstallationModel> listProjectInstallation;

    @OneToMany(mappedBy = "idUserPic", fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private List<ManagedServicesModel> listManagedServices;

    @OneToMany(mappedBy = "idUser", fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private List<ServicesModel> listService;

    public void setId(String id){
        this.id = id;
    }

    public String getId(){
        return id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public void setNip(String nip) { this.nip = nip; }

    public String getNip() {
        return nip;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getFullname() {
        return fullname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getSurname() {
        return surname;
    }

    public Set<RoleModel> getRoles() {
        return roles;
    }

    public void setRoles(Set<RoleModel> roles) {
        this.roles = roles;
    }

    public void setListService(List<ServicesModel> listService) {
        this.listService = listService;
    }

    public List<ServicesModel> getListService() {
        return listService;
    }

    public void setListProjectInstallation(List<ProjectInstallationModel> listProjectInstallation) {
        this.listProjectInstallation = listProjectInstallation;
    }

    public List<ProjectInstallationModel> getListProjectInstallation() {
        return listProjectInstallation;
    }

    public void setListManagedServices(List<ManagedServicesModel> listManagedServices) {
        this.listManagedServices = listManagedServices;
    }

    public List<ManagedServicesModel> getListManagedServices() {
        return listManagedServices;
    }
}