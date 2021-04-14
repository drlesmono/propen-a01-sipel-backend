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
public class BastModel implements Serializable{

    @Id
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idReport", referencedColumnName = "idReport", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private ReportModel idReportBast;

    @NotNull
    @Column(name="bastNum", nullable = false)
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String bastNum;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="dateHandover", nullable = false)
    private Date dateHandover;

    @NotNull
    @Column(name="idMaintenance", nullable = false)
    private Long idMaintenance;

    @NotNull
    @Column(name="idOrderPi", nullable = false)
    private Long idOrderPi;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="startPeriod", nullable = false)
    private Date startPeriod;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="endPeriod", nullable = false)
    private Date endPeriod;


    public void setIdReportBast(ReportModel idReportBast) {
        this.idReportBast = idReportBast;
    }

    public void setBastNum(String bastNum) {
        this.bastNum = bastNum;
    }

    public void setDateHandover(Date dateHandover) {
        this.dateHandover = dateHandover;
    }

    public void setIdMaintenance(Long idMaintenance) {
        this.idMaintenance = idMaintenance;
    }

    public void setIdOrderPi(Long idOrderPi) {
        this.idOrderPi = idOrderPi;
    }

    public void setStartPeriod(Date startPeriod) {
        this.startPeriod = startPeriod;
    }

    public void setEndPeriod(Date endPeriod) {
        this.endPeriod = endPeriod;
    }

    public ReportModel getIdReportBast() {
        return idReportBast;
    }

    public String getBastNum() {
        return bastNum;
    }

    public Date getDateHandover() {
        return dateHandover;
    }

    public Long getIdMaintenance() {
        return idMaintenance;
    }

    public Long getIdOrderPi() {
        return idOrderPi;
    }

    public Date getStartPeriod() {
        return startPeriod;
    }

    public Date getEndPeriod() {
        return endPeriod;
    }
}
