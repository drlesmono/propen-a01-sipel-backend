package propen.impl.sipel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "task")
public class TaskModel {

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "idOrderPi", referencedColumnName = "idOrderPi", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private ProjectInstallationModel idOrderPi;

    @NotNull
    @Column(name="taskName", nullable = false)
    private String taskName;

    @NotNull
    @Column(name="percentage", nullable = false)
    private Float percentage;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "idUserPic", referencedColumnName = "id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private UserModel idUserPic;

    public void setIdOrderPi(ProjectInstallationModel idOrderPi) {
        this.idOrderPi = idOrderPi;
    }

    public void setIdUserPic(UserModel idUserPic) {
        this.idUserPic = idUserPic;
    }

    public void setPercentage(Float percentage) {
        this.percentage = percentage;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public UserModel getIdOrderPi() {
        return idOrderPi;
    }

    public UserModel getIdUserPic() {
        return idUserPic;
    }

    public Float getPercentage() {
        return percentage;
    }

    public String getTaskName() {
        return taskName;
    }

    pub

}
