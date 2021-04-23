package propen.impl.sipel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "services")
public class ServicesModel implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idService;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "idOrderMS", referencedColumnName = "idOrderMS", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private ManagedServicesModel idOrderMS;

    @NotNull
    @Column(name="name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idUser", referencedColumnName = "id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private UserModel idUser;

    public Long getIdService() {
        return idService;
    }

    public void setIdService(Long idService) {
        this.idService = idService;
    }

    public ManagedServicesModel getIdOrderMS() {
        return idOrderMS;
    }

    public void setIdOrderMS(ManagedServicesModel idOrderMS) {
        this.idOrderMS = idOrderMS;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UserModel getIdUser() {
        return idUser;
    }

    public void setIdUser(UserModel idUser) {
        this.idUser = idUser;
    }

    public ServicesModel() {

    }
    public ServicesModel(String name, ManagedServicesModel idOrderMS) {
        this.name = name;
        this.idOrderMS = idOrderMS;
    }
}
