package propen.impl.sipel.rest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.validation.constraints.NotNull;

@JsonIgnoreProperties(allowGetters = true)
public class ManagedServicesDto {

    private Long idOrderMs;

    private String idUserPic;

    @NotNull
    private String actualStart;

    @NotNull
    private String actualEnd;

    @NotNull
    private Boolean isActivated;

//    private Long timeRemaining;

    private String dateClosedMS;

    private String status;

    public Long getIdOrderMs() {
        return idOrderMs;
    }

    public void setIdOrderMs(Long idOrderMs) {
        this.idOrderMs = idOrderMs;
    }

    public String getIdUserPic() {
        return idUserPic;
    }

    public void setIdUserPic(String idUserPic) {
        this.idUserPic = idUserPic;
    }

    public String getActualStart() {
        return actualStart;
    }

    public void setActualStart(String actualStart) {
        this.actualStart = actualStart;
    }

    public String getActualEnd() {
        return actualEnd;
    }

    public void setActualEnd(String actualEnd) {
        this.actualEnd = actualEnd;
    }

    public Boolean getActivated() {
        return isActivated;
    }

    public void setActivated(Boolean activated) {
        isActivated = activated;
    }

//    public Long getTimeRemaining() {
//        return timeRemaining;
//    }
//
//    public void setTimeRemaining(Long timeRemaining) {
//        this.timeRemaining = timeRemaining;
//    }

    public String getDateClosedMS() {
        return dateClosedMS;
    }

    public void setDateClosedMS(String dateClosedMS) {
        this.dateClosedMS = dateClosedMS;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
