import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  }));

export default function CustomizedButtons(props) {
    const { onClick, children, variant, color, key, id, size, value } = props;
    const classes = useStyles();

    return (
        <Button
            key={key}
            id={id}
            onClick={onClick}
            variant={variant}
            color={color}
            size={size}
            value={value}
            className={classes.margin}
            >
            {children}
        </Button>
    );
}