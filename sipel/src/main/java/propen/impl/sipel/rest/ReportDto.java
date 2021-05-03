package propen.impl.sipel.rest;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.format.annotation.DateTimeFormat;
import propen.impl.sipel.model.BastModel;
import propen.impl.sipel.model.InstallationReportModel;
import propen.impl.sipel.model.MaintenanceReportModel;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@JsonIgnoreProperties(allowGetters = true)
public class ReportDto {

    private Long idReport;

    private String reportName;

    private Date uploadedDate;

    private String statusApproval;

    private Boolean isSigned;

    private String reportType;

    private InstallationReportModel idInstallationReport;

    private MaintenanceReportModel idMaintenanceReport;

    private BastModel idBast;

    public Long getIdReport() {
        return idReport;
    }

    public void setIdReport(Long idReport) {
        this.idReport = idReport;
    }

    public String getReportName() {
        return reportName;
    }

    public void setReportName(String reportName) {
        this.reportName = reportName;
    }

    public Date getUploadedDate() {
        return uploadedDate;
    }

    public void setUploadedDate(Date uploadedDate) {
        this.uploadedDate = uploadedDate;
    }

    public String getStatusApproval() {
        return statusApproval;
    }

    public void setStatusApproval(String statusApproval) {
        this.statusApproval = statusApproval;
    }

    public Boolean getSigned() {
        return isSigned;
    }

    public void setSigned(Boolean signed) {
        isSigned = signed;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public InstallationReportModel getIdInstallationReport() {
        return idInstallationReport;
    }

    public void setIdInstallationReport(InstallationReportModel idInstallationReport) {
        this.idInstallationReport = idInstallationReport;
    }

    public MaintenanceReportModel getIdMaintenanceReport() {
        return idMaintenanceReport;
    }

    public void setIdMaintenanceReport(MaintenanceReportModel idMaintenanceReport) {
        this.idMaintenanceReport = idMaintenanceReport;
    }

    public BastModel getIdBast() {
        return idBast;
    }

    public void setIdBast(BastModel idBast) {
        this.idBast = idBast;
    }
}
