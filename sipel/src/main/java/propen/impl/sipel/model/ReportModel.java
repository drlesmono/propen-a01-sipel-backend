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
@Table(name = "report")
public class ReportModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReport;

    @NotNull
    @Column(name = "reportName", nullable = false)
    private String reportName;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="uploadedDate", nullable = false)
    private Date uploadedDate;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idOrder", referencedColumnName = "idOrder", nullable = false)
    @OnDelete(OnDeleteAction.CASCADE)
    @JsonIgnore
    private OrderModel idOrder;

    @NotNull
    @Column(name = "statusApproval", nullable = false)
    private String statusApproval;

    @NotNull
    @Column(name = "isSigned", nullable = false)
    private Boolean isSigned;

    @NotNull
    @Column(name = "reportType", nullable = false)
    private String reportType;

    @OneToOne(mappedBy = "idReport")
    @OnDelete(OnDeleteAction.CASCADE)
    @JsonIgnore
    private BastModel Bast;

    @OneToOne(mappedBy = "idReportInstallation")
    @OnDelete(OnDeleteAction.CASCADE)
    @JsonIgnore
    private InstallationReportModel installationReport;

    @OneToOne(mappedBy = "idReportInstallation")
    @OnDelete(OnDeleteAction.CASCADE)
    @JsonIgnore
    private MaintenanceReportModel maintenanceReport;

    public void setIdOrder(OrderModel idOrder) {
        this.idOrder = idOrder;
    }

    public void setIdReport(Long idReport) {
        this.idReport = idReport;
    }

    public void setReportName(String reportName) {
        this.reportName = reportName;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public void setIsSigned(Boolean signed) {
        this.isSigned = isSigned;
    }

    public void setStatusApproval(String statusApproval) {
        this.statusApproval = statusApproval;
    }

    public void setUploadedDate(Date uploadedDate) {
        this.uploadedDate = uploadedDate;
    }

    public void setBast(BastModel bast) {
        Bast = bast;
    }

    public void setInstallationReport(InstallationReportModel installationReport) {
        this.installationReport = installationReport;
    }

    public void setMaintenanceReport(MaintenanceReportModel maintenanceReport) {
        this.maintenanceReport = maintenanceReport;
    }

    public OrderModel getIdOrder() {
        return idOrder;
    }

    public Long getIdReport() {
        return idReport;
    }

    public String getReportName() {
        return reportName;
    }

    public String getReportType() {
        return reportType;
    }

    public Boolean getIsSigned() {
        return isSigned;
    }

    public String getStatusApproval() {
        return statusApproval;
    }

    public Date getUploadedDate() {
        return uploadedDate;
    }

    public BastModel getBast() {
        return Bast;
    }

    public InstallationReportModel getInstallationReport() {
        return installationReport;
    }

    public MaintenanceReportModel getMaintenanceReport() {
        return maintenanceReport;
    }
}
