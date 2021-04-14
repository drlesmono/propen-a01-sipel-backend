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
public class MaintenanceReportModel extends ReportModel{

//    @Id
//    @OneToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "idReport", referencedColumnName = "idReport", nullable = false)
//    @OnDelete(action = OnDeleteAction.CASCADE)
//    @JsonIgnore
//    private ReportModel idReportMaintenance;

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMaintenanceReport;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idMaintenance", referencedColumnName = "idMaintenance", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private MaintenanceModel idMaintenance;

//    public ReportModel getIdReportMaintenance() {
//        return idReportMaintenance;
//    }
//
//    public void setIdReportMaintenance(ReportModel idReportMaintenance) {
//        this.idReportMaintenance = idReportMaintenance;
//    }

    public Long getIdMaintenanceReport() {
        return idMaintenanceReport;
    }

    public void setIdMaintenanceReport(Long idMaintenanceReport) {
        this.idMaintenanceReport = idMaintenanceReport;
    }

    public MaintenanceModel getIdMaintenance() {
        return idMaintenance;
    }

    public void setIdMaintenance(MaintenanceModel idMaintenance) {
        this.idMaintenance = idMaintenance;
    }
}
