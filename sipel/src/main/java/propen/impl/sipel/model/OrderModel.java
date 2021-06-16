package propen.impl.sipel.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.QueryAnnotation;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.parameters.P;

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
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
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

    @Column(name="clientDiv", nullable = true)
    private String clientDiv;

    @NotNull
    @Column(name="clientPIC", nullable = false)
    private String clientPIC;

    @NotNull
    @Column(name="clientEmail", nullable = false)
    private String clientEmail;

    @Column(name="clientPhone", nullable = true)
    private String clientPhone;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="dateOrder", nullable = false)
    private Date dateOrder;

    @Column(name="noPO", nullable = true)
    private String noPO;

    @Column(name="noSPH", nullable = true)
    private String noSPH;

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

    @Column(name="nama_verifikasi", nullable = true)
    private String nama_verifikasi;

    public String getNama_verifikasi() {
        return nama_verifikasi;
    }

    public void setNama_verifikasi(String nama_verifikasi) {
        this.nama_verifikasi = nama_verifikasi;
    }

    @OneToOne(mappedBy = "idOrder", fetch = FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private ProjectInstallationModel idOrderPi;

    @OneToOne(mappedBy = "idOrder", fetch = FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private ManagedServicesModel idOrderMs;

//    @ManyToOne(fetch = FetchType.EAGER, optional = false)
//    @JoinColumn(name = "idUser", referencedColumnName = "id", nullable = false)
//    @OnDelete(action = OnDeleteAction.CASCADE)
//    @JsonIgnore
//    private UserModel idUser;

    @OneToMany(mappedBy = "idOrder", fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private List<DocumentOrderModel> documentOrder;

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

    public List<DocumentOrderModel> getDocumentOrder() {
        return documentOrder;
    }

    public void setDocumentOrder(List<DocumentOrderModel> documentOrder) {
        this.documentOrder = documentOrder;
    }

    public String getClientPIC() {
        return clientPIC;
    }

    public void setClientPIC(String clientPIC) {
        this.clientPIC = clientPIC;
    }

    public String getNoSPH() {
        return noSPH;
    }

    public void setNoSPH(String noSPH) {
        this.noSPH = noSPH;
    }

//    @Modifying
//    @Query(value = "insert into orders (client_div, client_email, client_name, client_org, clientpic, client_phone, date_order, description, is_managed_service, is_project_installation, is_verified, nama_verifikasi, nopo, nosph, order_name) values (:client_div, :client_email, :client_name, :client_org, :clientpic, :client_phone, :date_order, :description, :is_managed_service, :is_project_installation, :is_verified, :nama_verifikasi, :nopo, :nosph, :order_name)",
//          nativeQuery = true)
//    public void insertOrder(@Param("client_div") String client_div, @Param("client_email") String client_email, @Param("client_name") String client_name,
//                     @Param("client_org") String client_org, @Param("clientpic") String clientpic, @Param("client_phone") String client_phone,
//                     @Param("date_order") Date date_order, @Param("description") String description, @Param("is_managed_service") Boolean is_managed_service,
//                     @Param("is_project_installation") Boolean is_project_installation, @Param("is_verified") Boolean is_verified, @Param("nama_verifikasi") String nama_verifikasi,
//                     @Param("nopo") String nopo, @Param("nosph") String nosph, @Param("order_name") String order_name){}
}