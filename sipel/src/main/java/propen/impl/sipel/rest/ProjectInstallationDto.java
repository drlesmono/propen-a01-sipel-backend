package propen.impl.sipel.rest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.validation.constraints.NotNull;

@JsonIgnoreProperties(allowGetters = true)
public class ProjectInstallationDto {

    private Long idOrderPi;

    private String idUserEng;

    @NotNull
    private Float percentage;

    @NotNull
    private String startPI;

    @NotNull
    private String deadline;

    private String dateClosedPI;

    private String status;

    public Long getIdOrderPi() {
        return idOrderPi;
    }

    public void setIdOrderPi(Long idOrderPi) {
        this.idOrderPi = idOrderPi;
    }

    public String getIdUserEng() {
        return idUserEng;
    }

    public void setIdUserEng(String idUserEng) {
        this.idUserEng = idUserEng;
    }

    public Float getPercentage() {
        return percentage;
    }

    public void setPercentage(Float percentage) {
        this.percentage = percentage;
    }

    public String getStartPI() {
        return startPI;
    }

    public void setStartPI(String startPI) {
        this.startPI = startPI;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public String getDateClosedPI() {
        return dateClosedPI;
    }

    public void setDateClosedPI(String dateClosedPI) {
        this.dateClosedPI = dateClosedPI;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
