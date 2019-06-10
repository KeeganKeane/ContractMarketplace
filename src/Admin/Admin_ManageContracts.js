import React, { useState, useEffect } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
// import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import { lighten } from "@material-ui/core/styles/colorManipulator";
// import "./Admin_ManageContracts.css";
import Admin_NavBar from "./Admin_NavBar";
import firebase from "../firebase.js";

function Admin_ManageContracts() {
  // declare state variables
  const [initialized, setInitialized] = useState(false);
  // const [companyName, setCompanyName] = useState("");
  // const [contractTitle, setContractTitle] = useState("");
  // const [contractDetails, setContractDetails] = useState("");
  // const [isAvailable, setIsAvailable] = useState(true);

  const contracts = [];

  useEffect(() => {
    if (!initialized) {
      //find the user and save the information
      // let curEmail = "";
      // var user = firebase.auth().currentUser;
      // if (user !== null) {
      //   curEmail = user.email; // save the email we are looking for

      const contractsRef = firebase.database().ref("contracts"); //reference to the database "contracts" key

      contractsRef.on("value", snapshot => {
        // console.log("snapshot", snapshot.val());
        snapshot.forEach(function(contractsSnapshot) {
          // console.log("contractsSnapshot", contractsSnapshot.val());
          contractsSnapshot.forEach(function(detailsSnapshot) {
            // console.log("detailsSnapshot", detailsSnapshot.val());
            detailsSnapshot.forEach(async function(contractFieldsSnapshot) {
              // console.log(
              //   "contractFieldsSnapshot",
              //   contractFieldsSnapshot.val()
              // );
              var contractField = contractFieldsSnapshot.val();
              if (!(contractField == "bids")) {
                contracts.push(contractField);
                // await setCompanyName(contractField.name);
                // await setContractTitle(contractField.contractName);
                // await setContractDetails(contractField.contractDetails);
                // await setIsAvailable(contractField.available);
              }
            });
          });
        });
      });
      setInitialized(true);
    }
  });

  function createData(company, title, details, available) {
    return { company, title, details, available };
  }

  const rows = [
    // for each loop through each contract of each company
    // contracts.forEach(function(contract) {
    //   let companyName = contract.name;
    //   console.log(companyName);
    //   let contractTitle = contract.contractName;
    //   let contractDetails = contract.contractDetails;
    //   let contractAvailable = contract.available;
    //   createData(companyName, contractTitle, contractDetails, contractAvailable);
    // })

    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9)
  ];

  function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  function getSorting(order, orderBy) {
    return order === "desc"
      ? (a, b) => desc(a, b, orderBy)
      : (a, b) => -desc(a, b, orderBy);
  }

  const headRows = [
    {
      id: "company",
      numeric: false,
      disablePadding: true,
      label: "Company"
    },
    {
      id: "title",
      numeric: false,
      disablePadding: false,
      label: "Contract Title"
    },
    {
      id: "details",
      numeric: false,
      disablePadding: false,
      label: "Contract Details"
    },
    {
      id: "available",
      numeric: false,
      disablePadding: false,
      label: "Available"
    }
  ];

  function EnhancedTableHead(props) {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort
    } = props;
    const createSortHandler = property => event => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ "aria-label": "Select all desserts" }}
            />
          </TableCell>
          {headRows.map(row => (
            <TableCell
              key={row.id}
              align={row.numeric ? "right" : "left"}
              padding={row.disablePadding ? "none" : "default"}
              sortDirection={orderBy === row.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === row.id}
                direction={order}
                onClick={createSortHandler(row.id)}
              >
                {row.label}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
  };

  const useToolbarStyles = makeStyles(theme => ({
    root: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3)
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
          },
    spacer: {
      flex: "1 1 100%"
    },
    actions: {
      color: theme.palette.text.secondary
    },
    title: {
      flex: "0 0 auto"
    }
  }));

  const deleteContractsClicked = e => {
    // Deletes contracts from server
  };

  const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subtitle1">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography variant="h6" id="tableTitle">
              Contracts
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 ? (
            <Tooltip title="Delete Contract(s)">
              <IconButton
                aria-label="Delete"
                onClick={() => deleteContractsClicked()}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Filter list">
              <IconButton aria-label="Filter list">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </Toolbar>
    );
  };

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
  };

  const useStyles = makeStyles(theme => ({
    root: {
      width: "100%"
      // marginTop: theme.spacing(3)
    },
    table: {
      minWidth: 750
    },
    tableWrapper: {
      overflowX: "auto"
    }
  }));

  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("company");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.company);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  function handleClick(event, name) {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Admin_NavBar title={"Manage Contracts"} />
      <EnhancedTableToolbar numSelected={selected.length} />
      <div className={classes.tableWrapper}>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size="medium"
        >
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <TableBody>
            {stableSort(rows, getSorting(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row.company);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={event => handleClick(event, row.company)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.company}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.company}
                    </TableCell>
                    <TableCell align="justify">{row.title}</TableCell>
                    <TableCell align="justify">{row.details}</TableCell>
                    <TableCell align="justify">{row.available}</TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 49 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          "aria-label": "Previous Page"
        }}
        nextIconButtonProps={{
          "aria-label": "Next Page"
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      {/* <strong>{companyName}</strong> */}
    </div>
  );
}

export default Admin_ManageContracts;
