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
@Table(name = "orders")
//@Inheritance(strategy=InheritanceType.JOINED)
public class OrderModel implements Serializable{

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

    @Column(name="noPO", nullable = true)
    private String noPO;

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

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idOrderPi", referencedColumnName = "idOrderPi", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private ProjectInstallationModel idOrderPi;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idOrderMs", referencedColumnName = "idOrderMs", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private ManagedServicesModel idOrderMs;

//    @ManyToOne(fetch = FetchType.EAGER, optional = false)
//    @JoinColumn(name = "idUser", referencedColumnName = "id", nullable = false)
//    @OnDelete(action = OnDeleteAction.CASCADE)
//    @JsonIgnore
//    private UserModel idUser;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idDoc", referencedColumnName = "idDoc", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private DocumentOrderModel documentOrder;

//    @OneToOne(mappedBy = "idOrder")
//    @OnDelete(action = OnDeleteAction.CASCADE)
//    @JsonIgnore
//    private ReportModel report;

//    public void setIdUser(Long idUser) {
//        this.idUser = idUser;
//    }

//    public Long getIdUser() {
//        return idUser;
//    }

    public Long getIdOrder() {
        return idOrder;
    }

    public void setIdOrder(Long idOrder) {
        this.idOrder = idOrder;
    }

    public String getOrderName() {
        return orderName;
    }

    public void setOrderName(String orderName) {
        this.orderName = orderName;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getClientOrg() {
        return clientOrg;
    }

    public void setClientOrg(String clientOrg) {
        this.clientOrg = clientOrg;
    }

    public String getClientDiv() {
        return clientDiv;
    }

    public void setClientDiv(String clientDiv) {
        this.clientDiv = clientDiv;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
    }

    public String getClientPhone() {
        return clientPhone;
    }

    public void setClientPhone(String clientPhone) {
        this.clientPhone = clientPhone;
    }

    public Date getDateOrder() {
        return dateOrder;
    }

    public void setDateOrder(Date dateOrder) {
        this.dateOrder = dateOrder;
    }

    public String getNoPO() {
        return noPO;
    }

    public void setNoPO(String noPO) {
        this.noPO = noPO;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getVerified() {
        return isVerified;
    }

    public void setVerified(Boolean verified) {
        isVerified = verified;
    }

    public Boolean getProjectInstallation() {
        return isProjectInstallation;
    }

    public void setProjectInstallation(Boolean projectInstallation) {
        isProjectInstallation = projectInstallation;
    }

    public Boolean getManagedService() {
        return isManagedService;
    }

    public void setManagedService(Boolean managedService) {
        isManagedService = managedService;
    }

    public ProjectInstallationModel getIdOrderPi() {
        return idOrderPi;
    }

    public void setIdOrderPi(ProjectInstallationModel idOrderPi) {
        this.idOrderPi = idOrderPi;
    }

    public ManagedServicesModel getIdOrderMs() {
        return idOrderMs;
    }

    public void setIdOrderMs(ManagedServicesModel idOrderMs) {
        this.idOrderMs = idOrderMs;
    }

    public DocumentOrderModel getDocumentOrder() {
        return documentOrder;
    }

    public void setDocumentOrder(DocumentOrderModel documentOrder) {
        this.documentOrder = documentOrder;
    }
}
