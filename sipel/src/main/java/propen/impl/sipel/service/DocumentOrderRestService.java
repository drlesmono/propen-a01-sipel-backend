package propen.impl.sipel.service;

import propen.impl.sipel.model.DocumentOrderModel;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ReportModel;
import propen.impl.sipel.rest.DocumentOrderDto;

import java.util.List;

public interface DocumentOrderRestService {
    List<DocumentOrderModel> retrieveListDocOrder(Long idOrder);

    List<DocumentOrderModel> getListDocOrder();

    DocumentOrderModel uploadDocument(DocumentOrderDto document, String urlFile);

    void deleteDocument(Long idDoc);

    DocumentOrderModel findDocumentById(Long idDoc);

    DocumentOrderModel findDocumentByDocumentName(String docName);
}
