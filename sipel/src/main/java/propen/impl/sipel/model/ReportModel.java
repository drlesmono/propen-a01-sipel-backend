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
//@Inheritance(strategy=InheritanceType.JOINED)
public class ReportModel implements Serializable{

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

//    @OneToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "idOrder", referencedColumnName = "idOrder", nullable = false)
//    @OnDelete(action = OnDeleteAction.CASCADE)
//    @JsonIgnore
//    private OrderModel idOrder;

    @NotNull
    @Column(name = "statusApproval", nullable = false)
    private String statusApproval;

    @NotNull
    @Column(name = "isSigned", nullable = false)
    private Boolean isSigned;

    @NotNull
    @Column(name = "reportType", nullable = false)
    private String reportType;

//    @OneToOne(mappedBy = "idReport")
//    @OnDelete(action = OnDeleteAction.CASCADE)
//    @JsonIgnore
//    private BastModel Bast;

    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "idInstallationReport", referencedColumnName = "idInstallationReport", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private InstallationReportModel idInstallationReport;

    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "idMaintenanceReport", referencedColumnName = "idMaintenanceReport", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private MaintenanceReportModel idMaintenanceReport;

//    public void setIdOrder(OrderModel idOrder) {
//        this.idOrder = idOrder;
//    }

//    public OrderModel getIdOrder() {
//        return idOrder;
//    }

//    public BastModel getBast() {
//        return Bast;
//    }
//
//    public void setBast(BastModel bast) {
//        Bast = bast;
//    }
//
//    public InstallationReportModel getIdInstallationReport() {
//        return idInstallationReport;
//    }
//
//    public void setIdInstallationReport(InstallationReportModel idInstallationReport) {
//        this.idInstallationReport = idInstallationReport;
//    }
//
//    public MaintenanceReportModel getIdMaintenanceReport() {
//        return idMaintenanceReport;
//    }
//
//    public void setIdMaintenanceReport(MaintenanceReportModel idMaintenanceReport) {
//        this.idMaintenanceReport = idMaintenanceReport;
//    }

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
}
