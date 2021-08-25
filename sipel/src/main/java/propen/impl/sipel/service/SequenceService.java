package propen.impl.sipel.service;

import propen.impl.sipel.model.SequenceModel;

import java.util.List;

public interface SequenceService {

    SequenceModel retrieveSequence();

    SequenceModel setSequence(Long sequence);
}
