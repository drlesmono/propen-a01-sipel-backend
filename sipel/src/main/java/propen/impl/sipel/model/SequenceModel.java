package propen.impl.sipel.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "sequence")

//@IdClass(ReportModel.class)
public class SequenceModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSequence;

    @NotNull
    @Column(name="sequenceValue", nullable = false)
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long sequenceValue;

    public Long getIdSequence() {
        return idSequence;
    }

    public Long getSequenceValue() {
        return sequenceValue;
    }

    public void setSequenceValue(Long sequenceValue) {
        this.sequenceValue = sequenceValue;
    }

    public void setIdSequence(Long idSequence) {
        this.idSequence = idSequence;
    }
}
