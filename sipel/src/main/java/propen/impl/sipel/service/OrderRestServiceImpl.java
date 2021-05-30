package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.*;
import propen.impl.sipel.repository.*;
import propen.impl.sipel.rest.ProgressOrderDto;

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

    @Autowired
    private MaintenanceDb maintenanceDb;

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
    public ProgressOrderDto getProgress(OrderModel order, String tipe) {
        ProgressOrderDto selectedOrderDto = new ProgressOrderDto();
        selectedOrderDto.setOrderName(order.getOrderName());
        if(tipe == "pi"){
            selectedOrderDto.setTipeOrder("Proyek Instalasi");
            selectedOrderDto.setCompletionPercentage(getProgressPI(order));
            selectedOrderDto.setStatusOrder(getStatusPI(order));
        }
        if(tipe == "ms"){
            selectedOrderDto.setTipeOrder("Managed Service");
            selectedOrderDto.setCompletionPercentage(getProgressMS(order));
            selectedOrderDto.setStatusOrder(getStatusMS(order));
        }

        return selectedOrderDto;
    }

    @Override
    public List<ProgressOrderDto> getAllProgress() {
        List<ProgressOrderDto> allProgress = new ArrayList<>();
        List<OrderModel> allOrder = orderDb.findAll();

        for(OrderModel order: allOrder){
            if(order.getVerified() == true){
                ProjectInstallationModel isPi = order.getIdOrderPi();
                ManagedServicesModel isMs = order.getIdOrderMs();
                Date today = new Date();
                if(isPi == null && isMs != null){
                    Date closedMs = isMs.getDateClosedMS();
                    if (closedMs == null){
                        ProgressOrderDto progressOrder = getProgress(order, "ms");
                        allProgress.add(progressOrder);
                    }
                    else{
                        if(closedMs.compareTo(today) > 0){
                            ProgressOrderDto progressOrder = getProgress(order, "ms");
                            allProgress.add(progressOrder);
                        }
                    }

                }
                if(isPi != null && isMs == null){
                    if(isPi.getClose() == false){
                        ProgressOrderDto progressOrder = getProgress(order, "pi");
                        allProgress.add(progressOrder);
                    }
                }
                if(isPi != null && isMs != null){
                    if(isPi.getClose() == false){
                        ProgressOrderDto progressOrder = getProgress(order, "pi");
                        allProgress.add(progressOrder);
                    }

                    Date closedMs = isMs.getDateClosedMS();
                    if (closedMs == null){
                        ProgressOrderDto progressOrder2 = getProgress(order, "ms");
                        allProgress.add(progressOrder2);
                    }
                    else{
                        if(closedMs.compareTo(today) > 0){
                            ProgressOrderDto progressOrder2 = getProgress(order, "ms");
                            allProgress.add(progressOrder2);
                        }
                    }

                }
            }
        }
        return allProgress;
    }

    @Override
    public Float getProgressPI(OrderModel order) {
        ProjectInstallationModel pi = order.getIdOrderPi();
        Float percentage = pi.getPercentage();
        return percentage;
    }

    @Override
    public Float getProgressMS(OrderModel order) {
        ManagedServicesModel ms = order.getIdOrderMs();
        List<MaintenanceModel> maintenanceList = new ArrayList<>();
        List<MaintenanceModel> allMaintenance = maintenanceDb.findAll();
        for(MaintenanceModel mn: allMaintenance){
            Long idMS1 = mn.getIdOrderMS().getIdOrderMs();
            Long idMS2 = ms.getIdOrderMs();
            if(idMS1.equals(idMS2)){
                maintenanceList.add(mn);
            }
        }
        Float progress = Float.valueOf(0);
        Float size = Float.valueOf(maintenanceList.size());
        if(size == 0){
            return progress;
        }else{
            for(MaintenanceModel main: maintenanceList){
                boolean stat = main.getMaintained();
                if (stat == true){
                    progress++;
                }
            }
            return (progress/size*100);
        }
    }

    @Override
    public String getStatusPI(OrderModel order) {
        ProjectInstallationModel pi = order.getIdOrderPi();
        Float percentage = pi.getPercentage();
        String defaultStatus = "In Progress";
        Boolean close = pi.getClose();
        Date deadline = pi.getDeadline();
        Date closed = pi.getDateClosedPI();
        UserModel eng = pi.getIdUserEng();
        Date now = new Date();
        Boolean isDue = now.after(deadline);
        if(close == true){
            defaultStatus = "Closed";
        }
        if(close == false){
            if(percentage == Float.valueOf(100)){
                defaultStatus = "Finished";
            }
            else{
                if(percentage == Float.valueOf(0) && eng==null){
                    defaultStatus = "On Hold";
                }
                else{
                    defaultStatus = "In Progress";
                }
            }
        }

        return defaultStatus;
    }

    @Override
    public String getStatusMS(OrderModel order) {
        ManagedServicesModel ms = order.getIdOrderMs();
        UserModel assigned = ms.getIdUserPic();
        Float percentage = getProgressMS(order);

        String defaultStatus = "Inactivate";
        Boolean activated = ms.getActivated();
        if (activated==true && assigned != null){
            defaultStatus = "Active";
        }

        return defaultStatus;
    }
}
