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
@Table(name = "managedServices")
public class ManagedServicesModel implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idOrderMs;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "idUserPic", referencedColumnName = "id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private UserModel idUserPic;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="actualStart", nullable = false)
    private Date actualStart;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="actualEnd", nullable = false)
    private Date actualEnd;

    @NotNull
    @Column(name = "isActivated", nullable = false)
    private Boolean isActivated;

    @NotNull
    @Column(name="timeRemaining", nullable = false)
    private Long timeRemaining;

    @OneToMany(mappedBy = "idService", fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private List<ServicesModel> listService;

    @OneToMany(mappedBy = "idMaintenance", fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private List<MaintenanceModel> listMaintenance;


    public void setIdOrderMs(Long idOrderMs) {
        this.idOrderMs = idOrderMs;
    }

    public void setIdUserPic(UserModel idUserPic) {
        this.idUserPic = idUserPic;
    }

    public void setActualStart(Date actualStart) {
        this.actualStart = actualStart;
    }

    public void setActualEnd(Date actualEnd) {
        this.actualEnd = actualEnd;
    }

    public void setTimeRemaining(Long timeRemaining) {
        this.timeRemaining = timeRemaining;
    }

    public void setIsActivated(Boolean activated) {
        this.isActivated = isActivated;
    }

    public void setListService(List<ServicesModel> listService) {
        this.listService = listService;
    }

    public void setListMaintenance(List<MaintenanceModel> listMaintenance) {
        this.listMaintenance = listMaintenance;
    }

    public Long getIdOrderMs() {
        return idOrderMs;
    }

    public UserModel getIdUserPic() {
        return idUserPic;
    }

    public Date getActualStart() {
        return actualStart;
    }

    public Date getActualEnd() {
        return actualEnd;
    }

    public Long getTimeRemaining() {
        return timeRemaining;
    }

    public Boolean getIsActivated() {
        return isActivated;
    }

    public List<ServicesModel> getListService() {
        return listService;
    }

    public List<MaintenanceModel> getListMaintenance() {
        return listMaintenance;
    }
}
