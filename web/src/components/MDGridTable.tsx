import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Paper } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import IntlMessages from '../../@jumbo/utils/IntlMessages';

// Language Switching data========
const switchData = {
  noDataFound: <IntlMessages id={'noDataFound'} />,
  selectLanguage: <IntlMessages id={'selectlanguage'} />,
  rowsPerPage: <IntlMessages id={'rowsPerPage'} />,
};

interface Data {
  [key: string]: any;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  rowCount: number;
  headCells: object[];
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { headCells } = props;
  const { classes, onSelectAllClick, order, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className={classes.tableHeader}>
      <TableRow>
        {headCells.map((headCell: any) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            style={{ color: '#fff', fontWeight: 'bold' }}
            padding={headCell.disablePadding ? 'none' : 'normal'}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const EnhancedTableCell = (props: any) => {
  const { row, headCells } = props;
  const rowKeys = Object.keys(row);
  const rowValues = Object.values(row);
  return (
    <>
      {headCells.map((h: any, idx: number) => {
        const value: any = rowValues[rowKeys.indexOf(h.key)] as any;
        return (
          <TableCell
            key={idx}
            component="th"
            scope="row"
            style={{ padding: 10, maxWidth: '30vw', overflowWrap: 'anywhere' }}>
            {value}
          </TableCell>
        );
      })}
    </>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: 10,
      [theme.breakpoints.down('sm')]: {
        marginTop: 20,
      },
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
      [theme.breakpoints.down('sm')]: {
        // minWidth: '100%',
      },
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
    tableHeader: {
      background: theme.palette.primary.main,
    },
  }),
);

interface Props {
  headCells: any;
  rows: any;
  loading?: boolean;
  pageNoHandler?: any;
  totalRecordCount?: any;
  paginationHide?: any;
}

const EnhancedTable: React.FC<any> = ({ headCells, rows, loading, pageNoHandler, totalRecordCount, paginationHide }) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('calories');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n: any) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    pageNoHandler('page', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    pageNoHandler('size', parseInt(event.target.value, 10));
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const dataTobeRender = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // console.log('rows=>', rows, 'page =>', page, 'roperpage=>', rowsPerPage, 'data to be render=>', dataTobeRender);
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table">
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells || []}
            />
            {rows.length === 0 && (
              <div
                style={{
                  marginTop: 15.5,
                  position: 'absolute',
                  maxWidth: '100%',
                  width: '80%',
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                {loading ? (
                  <CircularProgress size={25} />
                ) : (
                  <span style={{ color: '#7e7e7e' }}>{switchData.noDataFound}</span>
                )}
              </div>
            )}
            <TableBody>
              {rows.map((row: any, index: number) => {
                return (
                  <TableRow key={index}>
                    <EnhancedTableCell row={row} headCells={headCells} />
                  </TableRow>
                );
              })}
              {/* {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={1} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        {!paginationHide && (
          <TablePagination
            rowsPerPageOptions={[2, 10, 25]}
            component="div"
            count={totalRecordCount || rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={switchData.rowsPerPage}
          />
        )}
      </Paper>
      {/*  <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" /> */}
    </div>
  );
};

export default EnhancedTable;
