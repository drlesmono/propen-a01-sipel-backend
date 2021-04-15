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
@Table(name = "projectInstallation")
@IdClass(OrderModel.class)
public class ProjectInstallationModel implements Serializable{

    @Id
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idOrder", referencedColumnName = "idOrder", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private OrderModel idOrder;

//    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idOrderPi;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "idUserEng", referencedColumnName = "id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private UserModel idUserEng;

    @NotNull
    @Column(name="percentage", nullable = false)
    private Float percentage;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="deadline", nullable = false)
    private Date deadline;

    @NotNull
    @Column(name = "isClose", nullable = false)
    private Boolean isClose;

    @OneToMany(mappedBy = "idOrderPi", fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private List<TaskModel> listTask;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idInstallationReport", referencedColumnName = "idInstallationReport", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private InstallationReportModel idInstallationReport;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idBast", referencedColumnName = "idBast", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private BastModel idBast;

    public OrderModel getIdOrder() {
        return idOrder;
    }

    public void setIdOrder(OrderModel idOrder) {
        this.idOrder = idOrder;
    }

    public Long getIdOrderPi() {
        return idOrderPi;
    }

    public void setIdOrderPi(Long idOrderPi) {
        this.idOrderPi = idOrderPi;
    }

    public UserModel getIdUserEng() {
        return idUserEng;
    }

    public void setIdUserEng(UserModel idUserEng) {
        this.idUserEng = idUserEng;
    }

    public Float getPercentage() {
        return percentage;
    }

    public void setPercentage(Float percentage) {
        this.percentage = percentage;
    }

    public Date getDeadline() {
        return deadline;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public Boolean getClose() {
        return isClose;
    }

    public void setClose(Boolean close) {
        isClose = close;
    }

    public List<TaskModel> getListTask() {
        return listTask;
    }

    public void setListTask(List<TaskModel> listTask) {
        this.listTask = listTask;
    }

    public InstallationReportModel getIdInstallationReport() {
        return idInstallationReport;
    }

    public void setIdInstallationReport(InstallationReportModel idInstallationReport) {
        this.idInstallationReport = idInstallationReport;
    }

    public BastModel getIdBast() {
        return idBast;
    }

    public void setIdBast(BastModel idBast) {
        this.idBast = idBast;
    }
}
