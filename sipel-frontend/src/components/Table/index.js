import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#2F3F58',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 70,
  },
});

export default function CustomizedTables(props) {
  const classes = useStyles();
  const { headers, rows } = props

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
            <StyledTableRow>
                {headers.map((head, index) => (
                    <StyledTableCell align="center" key={index}>{head}</StyledTableCell>
                ))}
            </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell align="center" component="th" scope="row">{index+1}</StyledTableCell>
              {row.map((cell, index) => (
                <StyledTableCell align="left" key={index}>{cell}</StyledTableCell>
                ))} 
            </StyledTableRow>
          ))}
          {/* {tablerows} */}
        </TableBody>
      </Table>
    </TableContainer>
  );
}