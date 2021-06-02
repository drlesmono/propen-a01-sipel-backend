package propen.impl.sipel.rest;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.format.annotation.DateTimeFormat;
import propen.impl.sipel.model.MaintenanceModel;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.model.ReportModel;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@JsonIgnoreProperties(allowGetters = true)
public class BastDto {

    private Long idReport;

    private Long idBast;

    private String bastNum;

    private Date dateHandover;

    private Long idMaintenance;

    private Long idOrderMs;

    public Long getIdOrderMs() {
        return idOrderMs;
    }

    public void setIdOrderMs(Long idOrderMs) {
        this.idOrderMs = idOrderMs;
    }

    private Long idOrderPi;

    private Date startPeriod;

    private Date endPeriod;

    private String picName;

    public String getPicName() {
        return picName;
    }

    public void setPicName(String picName) {
        this.picName = picName;
    }

    public Long getIdReport() {
        return idReport;
    }

    public void setIdReport(Long idReport) {
        this.idReport = idReport;
    }

    public Long getIdBast() {
        return idBast;
    }

    public void setIdBast(Long idBast) {
        this.idBast = idBast;
    }

    public String getBastNum() {
        return bastNum;
    }

    public void setBastNum(String bastNum) {
        this.bastNum = bastNum;
    }

    public Date getDateHandover() {
        return dateHandover;
    }

    public void setDateHandover(Date dateHandover) {
        this.dateHandover = dateHandover;
    }

    public Long getIdMaintenance() {
        return idMaintenance;
    }

    public void setIdMaintenance(Long idMaintenance) {
        this.idMaintenance = idMaintenance;
    }

    public Long getIdOrderPi() {
        return idOrderPi;
    }

    public void setIdOrderPi(Long idOrderPi) {
        this.idOrderPi = idOrderPi;
    }

    public Date getStartPeriod() {
        return startPeriod;
    }

    public void setStartPeriod(Date startPeriod) {
        this.startPeriod = startPeriod;
    }

    public Date getEndPeriod() {
        return endPeriod;
    }

    public void setEndPeriod(Date endPeriod) {
        this.endPeriod = endPeriod;
    }


}
