package propen.impl.sipel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "report")
//@Inheritance(strategy=InheritanceType.JOINED)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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

    @NotNull
    @Column(name = "urlFile", nullable = false)
    private String urlFile;

    @NotNull
    @Column(name = "size", nullable = false)
    private Long size;

    @NotNull
    @Column(name = "fileType", nullable = false)
    private String fileType;

//    @OneToOne(mappedBy = "idReport")
//    @OnDelete(action = OnDeleteAction.CASCADE)
//    @JsonIgnore
//    private BastModel Bast;

    @OneToOne(mappedBy = "idReport", fetch = FetchType.LAZY, cascade=CascadeType.ALL)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private InstallationReportModel idInstallationReport;

    @OneToOne(mappedBy = "idReport", fetch = FetchType.LAZY, cascade=CascadeType.ALL)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private MaintenanceReportModel idMaintenanceReport;

    @OneToOne(mappedBy = "idReport", fetch = FetchType.LAZY, cascade=CascadeType.ALL)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
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

    public String getUrlFile() {
        return urlFile;
    }

    public void setUrlFile(String urlFile) {
        this.urlFile = urlFile;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
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