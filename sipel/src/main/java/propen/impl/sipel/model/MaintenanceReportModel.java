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
@Table(name = "maintenanceReport")
//@IdClass(ReportModel.class)
//@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MaintenanceReportModel implements Serializable{

    //    @Id
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idReport", referencedColumnName = "idReport", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
//    @JsonIgnore
    private ReportModel idReport;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMaintenanceReport;

    //    @NotNull
    @Column(name="mrNum", nullable = true)
    private String mrNum;

    @Column(name = "notes", nullable = true)
    private String notes;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idMaintenance", referencedColumnName = "idMaintenance", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
//    @JsonIgnore
    private MaintenanceModel idMaintenance;

//    public ReportModel getIdReportMaintenance() {
//        return idReportMaintenance;
//    }
//
//    public void setIdReportMaintenance(ReportModel idReportMaintenance) {
//        this.idReportMaintenance = idReportMaintenance;
//    }

    public ReportModel getIdReport() {
        return idReport;
    }

    public void setIdReport(ReportModel idReport) {
        this.idReport = idReport;
    }

    public Long getIdMaintenanceReport() {
        return idMaintenanceReport;
    }

    public void setIdMaintenanceReport(Long idMaintenanceReport) {
        this.idMaintenanceReport = idMaintenanceReport;
    }

    public String getMrNum() {
        return mrNum;
    }

    public void setMrNum(String mrNum) {
        this.mrNum = mrNum;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public MaintenanceModel getIdMaintenance() {
        return idMaintenance;
    }

    public void setIdMaintenance(MaintenanceModel idMaintenance) {
        this.idMaintenance = idMaintenance;
    }
}