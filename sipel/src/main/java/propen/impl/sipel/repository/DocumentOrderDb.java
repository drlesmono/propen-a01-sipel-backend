package propen.impl.sipel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import propen.impl.sipel.model.DocumentOrderModel;

import java.util.List;

@Repository
public interface DocumentOrderDb extends JpaRepository<DocumentOrderModel,Long>, PagingAndSortingRepository<DocumentOrderModel, Long> {
    List<DocumentOrderModel> findAllByOrderByUploadedDateDesc();

    DocumentOrderModel findByDocName(String docName);
}
