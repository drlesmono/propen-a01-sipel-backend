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
public class InstallationReportModel {

    @Id
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idReport", referencedColumnName = "idReport", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private ReportModel idReportInstallation;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idOrderPi", referencedColumnName = "idOrderPi", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private ProjectInstallationModel idOrderPi;

    public ReportModel getIdReportInstallation() {
        return idReportInstallation;
    }

    public void setIdOrderPi(ProjectInstallationModel idOrderPi) {
        this.idOrderPi = idOrderPi;
    }

    public void setIdReportInstallation(ReportModel idReportInstallation) {
        this.idReportInstallation = idReportInstallation;
    }

    public ProjectInstallationModel getIdOrderPi() {
        return idOrderPi;
    }
}
