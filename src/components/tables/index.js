import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme,withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TableHead from '@material-ui/core/TableHead';
import TextField from '@material-ui/core/TextField';


const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));


const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);


function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(name, calories, fat) {
  return { name, calories, fat };
}



const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});



export default function CustomPaginationActionsTable(props) {
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [sereachValue, setSereach] = React.useState([]);
  

  const title=props.title ? props.title : [];
  const rows=props.data;

  const getByFilter=()=>{
        
    let filteredDatas = []
    filteredDatas = props.data.filter(e => {
        let mathesItems = Object.values(e)
        return mathesItems.some(e => {
            const regex = new RegExp(sereachValue, 'gi')
            if (typeof e == 'string')
                return e.match(regex)
            else
              return false
        })
    })
    
    return filteredDatas;
     
};

  const newArr=(arr)=>{ 
      const newRow={...arr};
      delete newRow.id;

      return newRow;
  };

  

  

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, getByFilter().length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  
 
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
      <caption>
        <TextField
          label="Pesquisar" 
          variant="outlined"
          name="name" 
          onChange={e => setSereach(e.target.value)}
           
        />
      </caption>
      <TableHead>
          <TableRow key="0">
          {title.map((row)=>(
            <StyledTableCell>{row}</StyledTableCell> 
          ))} 
          </TableRow>
        </TableHead>

        <TableBody>
          {(rowsPerPage > 0
            ? getByFilter().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : getByFilter()
          ).map((rows) =>(
 
                  <StyledTableRow  key={rows.id}  data-id={rows.id}>
                    {props.actionBody &&
                    <TableCell style={{width:"200px"}} >
                        {props.actionBody}
                    </TableCell>   
                    }
                     
                    { Object.values(newArr(rows)).map((row) =>(                      
                          <TableCell>
                            {row}
                          </TableCell>                
                    ))}  
                                 
                    </StyledTableRow >
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 33 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10]}
              colSpan={3}
              count={rows.length}
              labelDisplayedRows={ ({ from, to, count }) =>`${from} - ${to === -1 ? count : to} de ${count !== -1 ? count : `${to}` }`}
              rowsPerPage={rowsPerPage}
              page={page}
              labelRowsPerPage={"Registros por Página"}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}