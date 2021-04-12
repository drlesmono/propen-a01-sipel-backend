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
import java.util.List;
import java.util.Date;

import java.sql.Timestamp;

@Entity
@Table(name = "order")
public class OrderModel implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idOrder;

    @NotNull
    @Column(name="orderName", nullable = false)
    private String orderName;

    @NotNull
    @Column(name="clientName", nullable = false)
    private String clientName;

    @NotNull
    @Column(name="clientOrg", nullable = false)
    private String clientOrg;

    @NotNull
    @Column(name="clientDiv", nullable = false)
    private String clientDiv;

    @NotNull
    @Column(name="clientEmail", nullable = false)
    private String clientEmail;

    @NotNull
    @Column(name="clientPhone", nullable = false)
    private String clientPhone;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="dateOrder", nullable = false)
    private Date dateOrder;

    @NotNull
    @Column(name="noSpk", nullable = false)
    private String noSpk;

    @NotNull
    @Column(name="description", nullable = false)
    private String description;

    @NotNull
    @Column(name="isVerified", nullable = false)
    private Boolean isVerified;

    @NotNull
    @Column(name="isProjectInstallation", nullable = false)
    private Boolean isProjectInstallation;

    @NotNull
    @Column(name="isManagedService", nullable = false)
    private Boolean isManagedService;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "idUser", referencedColumnName = "id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private UserModel idUser;

    @OneToOne(mappedBy = "idOrder")
    @OnDelete(OnDeleteAction.CASCADE)
    @JsonIgnore
    private DocumentOrderModel documentOrder;

    @OneToOne(mappedBy = "idOrder")
    @OnDelete(OnDeleteAction.CASCADE)
    @JsonIgnore
    private ReportModel report;

    public void setIdOrder(Long idOrder) {
        this.idOrder = idOrder;
    }

    public void setClientDiv(String clientDiv) {
        this.clientDiv = clientDiv;
    }

    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public void setClientOrg(String clientOrg) {
        this.clientOrg = clientOrg;
    }

    public void setClientPhone(String clientPhone) {
        this.clientPhone = clientPhone;
    }

    public void setDateOrder(Timestamp dateOrder) {
        this.dateOrder = dateOrder;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }

    public void setManagedService(Boolean managedService) {
        this.isManagedService = managedService;
    }

    public void setNoSpk(String noSpk) {
        this.noSpk = noSpk;
    }

    public void setOrderName(String orderName) {
        this.orderName = orderName;
    }

    public void setProjectInstallation(Boolean projectInstallation) {
        this.isProjectInstallation = projectInstallation;
    }

    public void setVerified(Boolean verified) {
        this.isVerified = verified;
    }

    public Long getIdOrder() {
        return idOrder;
    }

    public String getClientDiv() {
        return clientDiv;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public String getClientName() {
        return clientName;
    }

    public String getClientOrg() {
        return clientOrg;
    }

    public String getClientPhone() {
        return clientPhone;
    }

    public Boolean getProjectInstallation() {
        return isProjectInstallation;
    }

    public Boolean getManagedService() {
        return isManagedService;
    }

    public Boolean getVerified() {
        return isVerified;
    }

    public String getDescription() {
        return description;
    }

    public String getOrderName() {
        return orderName;
    }

    public Timestamp getDateOrder() {
        return dateOrder;
    }

    public Long getIdUser() {
        return idUser;
    }

    public String getNoSpk() {
        return noSpk;
    }
}
