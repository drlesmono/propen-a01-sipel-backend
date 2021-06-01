package propen.impl.sipel.rest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.web.multipart.MultipartFile;

//@JsonIgnoreProperties(allowGetters = true)
public class ReportDto {

    private Long idReport;

    private String reportName;

    private String uploadedDate;

    private String statusApproval;

    private Boolean isSigned;

    private String reportType;

    private MultipartFile file;

    private Long size;

    private String fileType;

    private Long idInstallationReport;

    private Long idMaintenanceReport;

    private Long idBast;

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

    public String getUploadedDate() {
        return uploadedDate;
    }

    public void setUploadedDate(String uploadedDate) {
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

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
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

    public Long getIdInstallationReport() {
        return idInstallationReport;
    }

    public void setIdInstallationReport(Long idInstallationReport) {
        this.idInstallationReport = idInstallationReport;
    }

    public Long getIdMaintenanceReport() {
        return idMaintenanceReport;
    }

    public void setIdMaintenanceReport(Long idMaintenanceReport) {
        this.idMaintenanceReport = idMaintenanceReport;
    }

    public Long getIdBast() {
        return idBast;
    }

    public void setIdBast(Long idBast) {
        this.idBast = idBast;
    }
}
