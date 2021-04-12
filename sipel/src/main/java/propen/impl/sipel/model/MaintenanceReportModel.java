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
@Table(name = "maintenanceReport")
public class MaintenanceReportModel {

    @Id
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idReport", referencedColumnName = "idReport", nullable = false)
    @OnDelete(OnDeleteAction.CASCADE)
    @JsonIgnore
    private ReportModel idReportMaintenance;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idMaintenance", referencedColumnName = "idMaintenance", nullable = false)
    @OnDelete(OnDeleteAction.CASCADE)
    @JsonIgnore
    private ManagedServicesModel idMaintenance;

    public void setIdReportMaintenance(ReportModel idReportMaintenance) {
        this.idReportMaintenance = idReportMaintenance;
    }

    public void setIdMaintenance(ReportModel idMaintenance) {
        this.idMaintenance = idMaintenance;
    }

    public ReportModel getIdReportMaintenance() {
        return idReportMaintenance;
    }

    public ReportModel getIdMaintenance() {
        return idMaintenance;
    }
}
