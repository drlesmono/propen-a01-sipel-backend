package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.DocumentOrderModel;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.repository.DocumentOrderDb;
import propen.impl.sipel.repository.OrderDb;
import propen.impl.sipel.rest.DocumentOrderDto;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class DocumentOrderRestServiceImpl implements DocumentOrderRestService{
    @Autowired
    DocumentOrderDb documentOrderDb;

    @Autowired
    OrderDb orderDb;

    @Override
    public List<DocumentOrderModel> retrieveListDocOrder(Long idOrder) {
        List<DocumentOrderModel> listDocOrder = getListDocOrder();
        List<DocumentOrderModel> newListDocOrder = new ArrayList<>();
        for (DocumentOrderModel i : listDocOrder) {
            if (i.getIdOrder().getIdOrder() == idOrder) {
                newListDocOrder.add(i);
            }
        }
        return newListDocOrder;
    }

    @Override
    public List<DocumentOrderModel> getListDocOrder() {
        return documentOrderDb.findAll();
    }

    @Override
    public DocumentOrderModel uploadDocument(DocumentOrderDto document, String urlFile) {
        DocumentOrderModel newDoc = new DocumentOrderModel();
        LocalDate localDate = LocalDate.now();
        Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        newDoc.setDocName(document.getDocName());
        newDoc.setUploadedDate(date);
        newDoc.setIdOrder(orderDb.findById(document.getIdOrder()).get());
        newDoc.setUrlFile(urlFile);
        newDoc.setFileType(document.getFileType());
        newDoc.setSize(document.getSize());
        return documentOrderDb.save(newDoc);
    }

    @Override
    public void deleteDocument(Long idDoc) {
        documentOrderDb.deleteById(idDoc);
    }

    @Override
    public DocumentOrderModel findDocumentById(Long idDoc) {
        return documentOrderDb.findById(idDoc).get();
    }

    @Override
    public DocumentOrderModel findDocumentByDocumentName(String docName) {
        return documentOrderDb.findByDocName(docName);
    }
}
