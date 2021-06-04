package propen.impl.sipel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@Table(name = "maintenance")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MaintenanceModel implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMaintenance;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="dateMn", nullable = false)
    private Date dateMn;

    @NotNull
    @Column(name = "isMaintained", nullable = false)
    private Boolean isMaintained;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "idOrderMS", referencedColumnName = "idOrderMS", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private ManagedServicesModel idOrderMS;

    @OneToMany(mappedBy = "idMaintenanceReport", fetch = FetchType.LAZY, cascade=CascadeType.ALL)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private List<MaintenanceReportModel> listMaintenanceReport;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idBast", referencedColumnName = "idBast", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private BastModel bast;

    public Long getIdMaintenance() {
        return idMaintenance;
    }

    public void setIdMaintenance(Long idMaintenance) {
        this.idMaintenance = idMaintenance;
    }

    public Date getDateMn() {
        return dateMn;
    }

    public void setDateMn(Date dateMn) {
        this.dateMn = dateMn;
    }

    public Boolean getMaintained() {
        return isMaintained;
    }

    public void setMaintained(Boolean maintained) {
        isMaintained = maintained;
    }

    public ManagedServicesModel getIdOrderMS() {
        return idOrderMS;
    }

    public void setIdOrderMS(ManagedServicesModel idOrderMS) {
        this.idOrderMS = idOrderMS;
    }

    public List<MaintenanceReportModel> getListMaintenanceReport() {
        return listMaintenanceReport;
    }

    public void setListMaintenanceReport(List<MaintenanceReportModel> listMaintenanceReport) {
        this.listMaintenanceReport = listMaintenanceReport;
    }

    public BastModel bast() {
        return bast;
    }

    public void setListBast(BastModel bast) {
        this.bast = bast;
    }
}
