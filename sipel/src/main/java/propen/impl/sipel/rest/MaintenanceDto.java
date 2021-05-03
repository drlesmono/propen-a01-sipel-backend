package propen.impl.sipel.rest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import propen.impl.sipel.model.BastModel;
import propen.impl.sipel.model.MaintenanceReportModel;
import propen.impl.sipel.model.ManagedServicesModel;

import javax.validation.constraints.NotNull;
import java.util.Date;

@JsonIgnoreProperties(allowGetters = true)
public class MaintenanceDto {

    private Long idMaintenance;

    @NotNull
    private Date dateMn;

    @NotNull
    private Boolean isMaintained;

    private ManagedServicesModel idOrderMS;

    private MaintenanceReportModel idMaintenanceReport;

    private BastModel bast;


    public Long getIdMaintenance() {
        return idMaintenance;
    }

    public void setIdMaintenance(Long idMaintenance) {
        this.idMaintenance = idMaintenance;
    }

    public Date getDateMn() {
        return dateMn;
    }

    public void setDateMn(Date dateMn) {
        this.dateMn = dateMn;
    }

    public Boolean getMaintained() {
        return isMaintained;
    }

    public void setMaintained(Boolean maintained) {
        isMaintained = maintained;
    }

    public ManagedServicesModel getIdOrderMS() {
        return idOrderMS;
    }

    public void setIdOrderMS(ManagedServicesModel idOrderMS) {
        this.idOrderMS = idOrderMS;
    }

    public MaintenanceReportModel getIdMaintenanceReport() {
        return idMaintenanceReport;
    }

    public void setIdMaintenanceReport(MaintenanceReportModel idMaintenanceReport) {
        this.idMaintenanceReport = idMaintenanceReport;
    }

    public BastModel getBast() {
        return bast;
    }

    public void setBast(BastModel bast) {
        this.bast = bast;
    }
}
