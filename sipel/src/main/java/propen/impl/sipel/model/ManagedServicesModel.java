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
public class ManagedServicesModel extends OrderModel{

//    @Id
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
//    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="timeRemaining", nullable = false)
    private int timeRemaining;

    @OneToMany(mappedBy = "idOrderMS", fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private List<ServicesModel> listService;

    @OneToMany(mappedBy = "idOrderMS", fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private List<MaintenanceModel> listMaintenance;

    public Long getIdOrderMs() {
        return idOrderMs;
    }

    public void setIdOrderMs(Long idOrderMs) {
        this.idOrderMs = idOrderMs;
    }

    public UserModel getIdUserPic() {
        return idUserPic;
    }

    public void setIdUserPic(UserModel idUserPic) {
        this.idUserPic = idUserPic;
    }

    public Date getActualStart() {
        return actualStart;
    }

    public void setActualStart(Date actualStart) {
        this.actualStart = actualStart;
    }

    public Date getActualEnd() {
        return actualEnd;
    }

    public void setActualEnd(Date actualEnd) {
        this.actualEnd = actualEnd;
    }

    public Boolean getActivated() {
        return isActivated;
    }

    public void setActivated(Boolean activated) {
        isActivated = activated;
    }

    public int getTimeRemaining() {
        return timeRemaining;
    }

    public void setTimeRemaining(int timeRemaining) {
        this.timeRemaining = timeRemaining;
    }

    public List<ServicesModel> getListService() {
        return listService;
    }

    public void setListService(List<ServicesModel> listService) {
        this.listService = listService;
    }

    public List<MaintenanceModel> getListMaintenance() {
        return listMaintenance;
    }

    public void setListMaintenance(List<MaintenanceModel> listMaintenance) {
        this.listMaintenance = listMaintenance;
    }
}
