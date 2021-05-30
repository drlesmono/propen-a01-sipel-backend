package propen.impl.sipel.rest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.validation.constraints.NotNull;

@JsonIgnoreProperties(allowGetters = true)
public class ProgressOrderDto {

    @NotNull
    private String orderName;

    @NotNull
    private String tipeOrder;

    @NotNull
    private String statusOrder;

    @NotNull
    private Float completionPercentage;

    public String getOrderName() {
        return orderName;
    }

    public void setOrderName(String orderName) {
        this.orderName = orderName;
    }

    public String getTipeOrder() {
        return tipeOrder;
    }

    public void setTipeOrder(String tipeOrder) {
        this.tipeOrder = tipeOrder;
    }

    public String getStatusOrder() {
        return statusOrder;
    }

    public void setStatusOrder(String statusOrder) {
        this.statusOrder = statusOrder;
    }

    public Float getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Float completionPercentage) {
        this.completionPercentage = completionPercentage;
    }
}
