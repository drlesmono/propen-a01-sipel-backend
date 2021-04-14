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
@Table(name = "installationReport")
public class InstallationReportModel extends ReportModel{

//    @Id
//    @OneToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "idReport", referencedColumnName = "idReport", nullable = false)
//    @OnDelete(action = OnDeleteAction.CASCADE)
//    @JsonIgnore
//    private ReportModel idReportInstallation;

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInstallationReport;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idOrderPi", referencedColumnName = "idOrderPi", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private ProjectInstallationModel idOrderPi;

//    public ReportModel getIdReportInstallation() {
//        return idReportInstallation;
//    }
//
//    public void setIdReportInstallation(ReportModel idReportInstallation) {
//        this.idReportInstallation = idReportInstallation;
//    }

    public Long getIdInstallationReport() {
        return idInstallationReport;
    }

    public void setIdInstallationReport(Long idInstallationReport) {
        this.idInstallationReport = idInstallationReport;
    }

    public ProjectInstallationModel getIdOrderPi() {
        return idOrderPi;
    }

    public void setIdOrderPi(ProjectInstallationModel idOrderPi) {
        this.idOrderPi = idOrderPi;
    }
}
