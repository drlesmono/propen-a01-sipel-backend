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
@Table(name = "installationReport")
//@IdClass(ReportModel.class)
//@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class InstallationReportModel implements Serializable{

    //    @Id
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idReport", referencedColumnName = "idReport", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
//    @JsonIgnore
    private ReportModel idReport;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInstallationReport;

    //    @NotNull
    @Column(name="irNum", nullable = true)
    private String irNum;

    @Column(name = "notes", nullable = true)
    private String notes;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idOrderPi", referencedColumnName = "idOrderPi", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
//    @JsonIgnore
    private ProjectInstallationModel idOrderPi;

//    public ReportModel getIdReportInstallation() {
//        return idReportInstallation;
//    }
//
//    public void setIdReportInstallation(ReportModel idReportInstallation) {
//        this.idReportInstallation = idReportInstallation;
//    }

    public ReportModel getIdReport() {
        return idReport;
    }

    public void setIdReport(ReportModel idReport) {
        this.idReport = idReport;
    }

    public Long getIdInstallationReport() {
        return idInstallationReport;
    }

    public void setIdInstallationReport(Long idInstallationReport) {
        this.idInstallationReport = idInstallationReport;
    }

    public String getIrNum() {
        return irNum;
    }

    public void setIrNum(String irNum) {
        this.irNum = irNum;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public ProjectInstallationModel getIdOrderPi() {
        return idOrderPi;
    }

    public void setIdOrderPi(ProjectInstallationModel idOrderPi) {
        this.idOrderPi = idOrderPi;
    }
}