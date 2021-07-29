package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.SequenceModel;
import propen.impl.sipel.repository.SequenceDb;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class SequenceServiceImpl implements  SequenceService{

    @Autowired
    SequenceDb sequenceDb;

    @Override
    public List<SequenceModel> retrieveListSequence() {
        return sequenceDb.findAll();
    }

    @Override
    public void setSequence(Long sequence) {
        SequenceModel seq = sequenceDb.findById(Long.valueOf(1)).get();
        seq.setSequenceValue(sequence);
    }
}
