package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.SequenceModel;
import propen.impl.sipel.repository.SequenceDb;

import javax.transaction.Transactional;

@Service
@Transactional
public class SequenceServiceImpl implements  SequenceService{

    @Autowired
    SequenceDb sequenceDb;

    @Override
    public SequenceModel retrieveSequence() {
        return sequenceDb.findById(Long.valueOf(1)).get();
    }

    @Override
    public SequenceModel setSequence(Long sequence) {
        SequenceModel seq = sequenceDb.findById(Long.valueOf(1)).get();
        seq.setSequenceValue(sequence);
        sequenceDb.save(seq);
        return seq;
    }
}
