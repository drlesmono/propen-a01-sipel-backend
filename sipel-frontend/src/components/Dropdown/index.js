import React from "react";
import { DropdownButton } from 'react-bootstrap';

const Dropdown = (props) => {
    const { title, items, actions } = props;

    return(
        <DropdownButton id="dropdown-basic-button" title={title}>
            {items.map( (item, index) =>
                <Dropdown.Item href={actions[index]} key={index}>{item}</Dropdown.Item>
            )}
        </DropdownButton>
    );
}

export default Dropdown;