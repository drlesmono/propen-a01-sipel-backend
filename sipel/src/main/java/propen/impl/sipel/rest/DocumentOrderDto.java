package propen.impl.sipel.rest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;

@JsonIgnoreProperties(allowGetters = true)
public class DocumentOrderDto {
    private Long idDoc;

    @NotNull
    private Long idOrder;

    private String docName;

    private String uploadedDate;

    private Long size;

    private String fileType;

    private MultipartFile file;

    public Long getIdDoc() {
        return idDoc;
    }

    public void setIdDoc(Long idDoc) {
        this.idDoc = idDoc;
    }

    public Long getIdOrder() {
        return idOrder;
    }

    public void setIdOrder(Long idOrder) {
        this.idOrder = idOrder;
    }

    public String getDocName() {
        return docName;
    }

    public void setDocName(String docName) {
        this.docName = docName;
    }

    public String getUploadedDate() {
        return uploadedDate;
    }

    public void setUploadedDate(String uploadedDate) {
        this.uploadedDate = uploadedDate;
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

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}
