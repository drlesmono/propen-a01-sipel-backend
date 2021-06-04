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
@Table(name = "bast")

//@IdClass(ReportModel.class)
public class BastModel implements Serializable{

    //    @Id
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idReport", referencedColumnName = "idReport", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private ReportModel idReport;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idBast;

    @NotNull
    @Column(name="bastNum", nullable = false)
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String bastNum;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="dateHandover", nullable = false)
    private Date dateHandover;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "idMaintenance", referencedColumnName = "idMaintenance", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private MaintenanceModel idMaintenance;

    @ManyToOne(fetch = FetchType.EAGER, optional=true)
    @JoinColumn(name = "idOrderPi", referencedColumnName = "idOrderPi", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private ProjectInstallationModel idOrderPi;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="startPeriod", nullable = true)
    private Date startPeriod;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="endPeriod", nullable = true)
    private Date endPeriod;



//    public void setIdReport(ReportModel idReport) {
//        this.idReport = idReport;
//    }

//    public ReportModel getIdReport() {
//        return idReport;
//    }

    public ReportModel getIdReport() {
        return idReport;
    }

    public void setIdReport(ReportModel idReport) {
        this.idReport = idReport;
    }

    public Long getIdBast() {
        return idBast;
    }

    public void setIdBast(Long idBast) {
        this.idBast = idBast;
    }

    public MaintenanceModel getIdMaintenance() {
        return idMaintenance;
    }

    public String getBastNum () { return bastNum; }
    public void setBastNum(String bastNum) {
        this.bastNum = bastNum;
    }

    public Date getDateHandover() {
        return dateHandover;
    }

    public void setDateHandover(Date dateHandover) {
        this.dateHandover = dateHandover;
    }

//    public MaintenanceModel getIdMaintenance() {
//        return idMaintenance;
//    }

    public void setIdMaintenance(MaintenanceModel idMaintenance) {
        this.idMaintenance = idMaintenance;
    }

    public ProjectInstallationModel getIdOrderPi() {
        return idOrderPi;
    }

    public void setIdOrderPi(ProjectInstallationModel idOrderPi) {
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
