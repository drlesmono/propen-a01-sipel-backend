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
public class ProjectInstallationModel {

    @Id
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

    @OneToOne(mappedBy = "idOrderPi")
    @OnDelete(OnDeleteAction.CASCADE)
    @JsonIgnore
    private InstallationReportModel installationReport;

    public void setIdOrderPi(Long idOrderPi) {
        this.idOrderPi = idOrderPi;
    }

    public void setIdUserEng(UserModel idUserEng) {
        this.idUserEng = idUserEng;
    }

    public void setPercentage(Float percentage) {
        this.percentage = percentage;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public void setIsClose(Boolean close) {
        this.isClose = isClose;
    }

    public void setListTask(List<TaskModel> listTask) {
        this.listTask = listTask;
    }

    public void setInstallationReport(InstallationReportModel installationReport) {
        this.installationReport = installationReport;
    }

    public Long getIdOrderPi() {
        return idOrderPi;
    }

    public UserModel getIdUserEng() {
        return idUserEng;
    }

    public Float getPercentage() {
        return percentage;
    }

    public Date getDeadline() {
        return deadline;
    }

    public Boolean getIsClose() {
        return isClose;
    }

    public List<TaskModel> getListTask() {
        return listTask;
    }

    public InstallationReportModel getInstallationReport() {
        return installationReport;
    }
}
