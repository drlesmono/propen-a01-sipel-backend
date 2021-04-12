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
public class ServicesModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idService;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "idOrderMs", referencedColumnName = "idOrderMs", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private ManagedServicesModel idOrderMs;

    @NotNull
    @Column(name="name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "idUser", referencedColumnName = "id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private UserModel idUser;

    public void setIdService(Long idService) {
        this.idService = idService;
    }

    public void setIdOrderMs(ManagedServicesModel idOrderMs) {
        this.idOrderMs = idOrderMs;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setIdUser(UserModel idUser) {
        this.idUser = idUser;
    }

    public Long getIdService() {
        return idService;
    }

    public ManagedServicesModel getIdOrderMs() {
        return idOrderMs;
    }

    public String getName() {
        return name;
    }

    public UserModel getIdUser() {
        return idUser;
    }
}
