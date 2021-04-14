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
@Table(name = "maintenance")
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

    @NotNull
    @Column(name = "idOrder", nullable = false)
    private Long idOrder;

    @OneToOne(mappedBy = "idMaintenance")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private MaintenanceReportModel maintenanceReport;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "idOrderMs", referencedColumnName = "idOrderMs", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private ManagedServicesModel idOrderMs;

    public void setIdMaintenance(Long idMaintenance) {
        this.idMaintenance = idMaintenance;
    }

    public void setIdOrder(Long idOrder) {
        this.idOrder = idOrder;
    }

    public void setMaintenanceReport(MaintenanceReportModel maintenanceReport) {
        this.maintenanceReport = maintenanceReport;
    }

    public void setDateMn(Date dateMn) {
        this.dateMn = dateMn;
    }

    public void setIsMaintained(Boolean maintained) {
        this.isMaintained = isMaintained;
    }

    public void setIdOrderMs(ManagedServicesModel idOrderMs) {
        this.idOrderMs = idOrderMs;
    }

    public Long getIdOrder() {
        return idOrder;
    }

    public Long getIdMaintenance() {
        return idMaintenance;
    }

    public Date getDateMn() {
        return dateMn;
    }

    public Boolean getIsMaintained() {
        return isMaintained;
    }

    public MaintenanceReportModel getMaintenanceReport() {
        return maintenanceReport;
    }

    public ManagedServicesModel getIdOrderMs() {
        return idOrderMs;
    }
}
