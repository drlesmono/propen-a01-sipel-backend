package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.*;
import propen.impl.sipel.repository.*;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
@Transactional
public class OrderRestServiceImpl implements OrderRestService{

    @Autowired
    private OrderDb orderDb;

    @Autowired
    private ProjectInstallationDb projectInstallationDb;

    @Autowired
    private ManagedServicesDb managedServicesDb;

    @Autowired
    private DocumentOrderDb documentOrderDb;

    @Autowired
    private BastDb bastDb;

    @Autowired
    private ReportDb reportDb;

    @Override
    public List<OrderModel> retrieveListOrderVerified() {
        List<OrderModel> listOrderVerified = new ArrayList<>();

        for(OrderModel order : orderDb.findAll()){
            if (order.getVerified() == true) {
                listOrderVerified.add(order);
            }
        }

        return listOrderVerified;
    }


    @Override
    public OrderModel findOrderById(Long idOrder) {
        return orderDb.findById(idOrder).get();
    }

    @Override
    public List<OrderModel> retrieveListOrderMs() {
        List<OrderModel> listOrderVerified = new ArrayList<>();

        for(OrderModel order : orderDb.findAllByIsManagedServiceIsTrue()){
            if (order.getVerified() == true) {
                listOrderVerified.add(order);
            }
        }

        return listOrderVerified;
    }

    @Override
    public OrderModel extendKontrak(Long idOrder, String noPO) {
        OrderModel order = orderDb.findById(idOrder).get();
        OrderModel newOrder = new OrderModel();
        String orderName = order.getOrderName();
        List<String> orderNameSplit;
        List<OrderModel> listOrderSameOrg = orderDb.findAllByClientOrg(order.getClientOrg());
        List<String> listOrderSameName = new ArrayList<>();
        orderNameSplit = Arrays.asList(orderName.split(" ver."));
        for(OrderModel orderOrg : listOrderSameOrg){
            if(orderOrg.getOrderName().contains(orderNameSplit.get(0))){
                listOrderSameName.add(orderOrg.getOrderName());
            }
        }

        if(orderName.contains("ver.")) {
//            String orderNameTarget = order.getOrderName();
            int i = 3;
            orderName = orderNameSplit.get(0) + " ver." + i;
            while(listOrderSameName.contains(orderName)){
                i++;
                orderName = orderNameSplit.get(0) + " ver." + i;
            }

            newOrder.setOrderName(orderName);
        }else{
            if(listOrderSameName.size() == 0) {
                newOrder.setOrderName(orderName + " ver.2");
            }else{
                int i = 3;
                orderName = orderNameSplit.get(0) + " ver." + i;
                while(listOrderSameName.contains(orderName)){
                    i++;
                    orderName = orderNameSplit.get(0) + " ver." + i;
                }

                newOrder.setOrderName(orderName);
            }
        }

        // default time zone
        ZoneId defaultZoneId = ZoneId.systemDefault();
        LocalDate currentDate = LocalDate.now();
        Date dateOrder = Date.from(currentDate.atStartOfDay(defaultZoneId).toInstant());

        newOrder.setClientName(order.getClientName());
        newOrder.setClientOrg(order.getClientOrg());
        newOrder.setClientDiv(order.getClientDiv());
        newOrder.setClientPIC(order.getClientPIC());
        newOrder.setClientEmail(order.getClientEmail());
        newOrder.setClientPhone(order.getClientPhone());
        newOrder.setDateOrder(dateOrder);
        newOrder.setNoPO(noPO);
        newOrder.setNoSPH(order.getNoSPH());
        newOrder.setDescription(order.getDescription());
        newOrder.setVerified(order.getVerified());
        newOrder.setProjectInstallation(false);
        newOrder.setManagedService(order.getManagedService());

        OrderModel orderSaved = orderDb.save(newOrder);

        ManagedServicesModel ms = managedServicesDb.findById(order.getIdOrderMs().getIdOrderMs()).get();
        ManagedServicesModel newMs = new ManagedServicesModel();
        newMs.setIdOrder(orderSaved);
        newMs.setIdUserPic(ms.getIdUserPic());
        newMs.setActualStart(ms.getActualStart());
        newMs.setActualEnd(ms.getActualEnd());
        newMs.setActivated(ms.getActivated());
        ManagedServicesModel msSaved = managedServicesDb.save(newMs);
        orderSaved.setIdOrderMs(msSaved);

        List<DocumentOrderModel> docOrder = order.getDocumentOrder();
        if(docOrder != null) {
            List<DocumentOrderModel> newDocOrder = new ArrayList<>();
            for (DocumentOrderModel doc : docOrder) {
                DocumentOrderModel newDoc = new DocumentOrderModel();
                newDoc.setIdOrder(orderSaved);
                newDoc.setDocName(doc.getDocName());
                newDoc.setUploadedDate(doc.getUploadedDate());
                newDoc.setDocType(doc.getDocType());
                DocumentOrderModel docSaved = documentOrderDb.save(newDoc);
                newDocOrder.add(docSaved);
            }
            orderSaved.setDocumentOrder(newDocOrder);
        }

        return newOrder;
    }

    @Override
    public List<OrderModel> retrieveListNotVerifiedOrder(){
        List<OrderModel> listNotVerifiedOrder = new ArrayList<>();

        for(OrderModel order : orderDb.findAll()){
            if (order.getVerified() == false) {
                listNotVerifiedOrder.add(order);
            }
        }

        return listNotVerifiedOrder;
    }

}
