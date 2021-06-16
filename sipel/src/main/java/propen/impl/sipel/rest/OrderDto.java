package propen.impl.sipel.rest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.validation.constraints.NotNull;

@JsonIgnoreProperties(allowGetters = true)
public class OrderDto {

    private Long idOrder;

    private String orderName;

    private String clientName;

    private String clientOrg;

    private String clientDiv;

    private String clientPIC;

    private String clientEmail;

    private String clientPhone;

    private String dateOrder;

    private String noPO;

    private String noSPH;

    private String description;

    private Boolean isVerified;

    private Boolean isProjectInstallation;

    private Boolean isManagedService;

    private Long idOrderPi;

    private Long idOrderMs;

    private String nama_verifikasi;

    public String getNama_verifikasi() {
        return nama_verifikasi;
    }

    public void setNama_verifikasi(String nama_verifikasi) {
        this.nama_verifikasi = nama_verifikasi;
    }

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

    public String getClientPIC() {
        return clientPIC;
    }

    public void setClientPIC(String clientPIC) {
        this.clientPIC = clientPIC;
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

    public String getDateOrder() {
        return dateOrder;
    }

    public void setDateOrder(String dateOrder) {
        this.dateOrder = dateOrder;
    }

    public String getNoPO() {
        return noPO;
    }

    public void setNoPO(String noPO) {
        this.noPO = noPO;
    }

    public String getNoSPH() {
        return noSPH;
    }

    public void setNoSPH(String noSPH) {
        this.noSPH = noSPH;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean verified) {
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

    public Long getIdOrderPi() {
        return idOrderPi;
    }

    public void setIdOrderPi(Long idOrderPi) {
        this.idOrderPi = idOrderPi;
    }

    public Long getIdOrderMs() {
        return idOrderMs;
    }

    public void setIdOrderMs(Long idOrderMs) {
        this.idOrderMs = idOrderMs;
    }
}
