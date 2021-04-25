import React from "react";

const ServiceList = (props) => {
    return (
        props.listService.map((val, idService) => {
            let name = `name-${idService}`;
            return (
                <tr key={val.idService}>
                    <td>
                        <input type="text"  name="name" data-id={idService} id={name} className="form-control " />
                    </td>
                    <td>
                        {
                            idService===0?<button onClick={()=>props.add()} type="button" className="btn btn-primary text-center"><i className="fa fa-plus-circle" aria-hidden="true"></i></button>
                            : <button className="btn btn-danger" onClick={(() => props.delete(val))} ><i className="fa fa-minus" aria-hidden="true"></i></button>
                        }
                    </td>
                </tr>
            )
        })
    );
}

export default ServiceList;