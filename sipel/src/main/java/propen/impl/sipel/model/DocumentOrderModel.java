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
@Table(name = "documentOrder")
public class DocumentOrderModel implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idOrder", referencedColumnName = "idOrder", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private OrderModel idOrder;

    @NotNull
    @Column(name="docName", nullable = false)
    private String docName;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name="uploadedDate", nullable = false)
    private Date uploadedDate;

    @NotNull
    @Column(name = "urlFile", nullable = false)
    private String urlFile;

    @NotNull
    @Column(name = "size", nullable = false)
    private Long size;

    @NotNull
    @Column(name = "fileType", nullable = false)
    private String fileType;

    public void setIdDoc(Long idDoc) {
        this.idDoc = idDoc;
    }

    public void setIdOrder(OrderModel idOrder) {
        this.idOrder = idOrder;
    }

    public void setDocName(String docName) {
        this.docName = docName;
    }

    public void setUploadedDate(Date uploadedDate) {
        this.uploadedDate = uploadedDate;
    }

    public Long getIdDoc() {
        return idDoc;
    }

    public OrderModel getIdOrder() {
        return idOrder;
    }

    public String getDocName() {
        return docName;
    }

    public Date getUploadedDate() {
        return uploadedDate;
    }

    public String getUrlFile() {
        return urlFile;
    }

    public void setUrlFile(String urlFile) {
        this.urlFile = urlFile;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }
}