package propen.impl.sipel.rest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.validation.constraints.NotNull;
import java.util.Date;

@JsonIgnoreProperties(allowGetters = true)
public class MaintenanceDto {

    @NotNull
    private Long idMaintenance;

    @NotNull
    private Date dateMn;

    @NotNull
    private Boolean isMaintained;

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
}