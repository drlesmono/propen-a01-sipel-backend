package propen.impl.sipel.rest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.validation.constraints.NotNull;

@JsonIgnoreProperties(allowGetters = true)
public class InstallationReportDto {

    private Long idInstallationReport;

    private String irNum;

    private String notes;

    @NotNull
    private Long idOrderPi;

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

    public Long getIdOrderPi() {
        return idOrderPi;
    }

    public void setIdOrderPi(Long idOrderPi) {
        this.idOrderPi = idOrderPi;
    }
}
