import React from "react";

const MaintenanceList = (props) => {
    return (
        props.listMaintenance.map((val, idx) => {
            let dateMn = `dateMn-${idx}`;
            return (
                <tr key={val.idx}>
                    <td>
                        <input type="date"  name="dateMn" data-id={idx} id={dateMn} className="form-control " />
                    </td>
                    <td>
                        {
                            idx===0?<button onClick={()=>props.add()} type="button" className="btn btn-primary text-center"><i className="fa fa-plus-circle" aria-hidden="true"></i></button>
                            : <button className="btn btn-danger" onClick={(() => props.delete(val))} ><i className="fa fa-minus" aria-hidden="true"></i></button>
                        }
                    </td>
                </tr>
            )
        })
    );
}

export default MaintenanceList;