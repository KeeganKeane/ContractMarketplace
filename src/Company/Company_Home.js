import React from "react";
import CompanyNavBar from "./Company_NavBar.js";
import firebase from "../firebase.js";
import List from "@material-ui/core/List";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import "./Company.css";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Search from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";

const useStyles = makeStyles(theme => ({
  //for material UI button
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  }
}));

class CompanyHome extends React.Component {
  state = {
    companyName: "",
    email: "",

    allContracts: [],
    availableContracts: [],
    assignedContracts: [],
    pending_search: "",
    assigned_search: ""
  };

  componentDidMount = async () => {
    document.title = "RevTek";
    this.fetchData();
  };

  fetchData() {
    //find the user and save the information
    let curEmail = "";
    // var user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(user => {
      console.log("1");
      if (user !== null) {
        console.log("1.a");
        curEmail = user.email; // save the email we are looking for

        const usersRef = firebase.database().ref("users"); //reference to the database "users" key
        let info = []; //for returning info
        usersRef.on("value", snapshot => {
          //console.log( snapshot.val() )
          console.log("1.b");
          snapshot.forEach(function(childSnapshot) {
            console.log("1.c");
            var item = childSnapshot.val();
            if (item.email === curEmail) {
              console.log("1.d");
              //if we've found the right folder
              info.push(item.name);
              info.push(item.email);
            }
          });
          this.setState({ companyName: info[0], email: info[1] }, () => {
            this.displayContracts();
          });
        });

        //get its contracts
        console.log("2");
      } else {
        console.log("user not set up");
      }
    });
  }

  displayContracts = () => {
    const contractRef = firebase
      .database()
      .ref("contracts/" + this.state.companyName);
    contractRef.on("value", snapshot => {
      console.log("3");

      let available = [];
      let assigned = [];
      snapshot.forEach(function(contracts) {
        console.log("4");

        contracts.forEach(function(individContract) {
          console.log("5");

          if (individContract.val().available) {
            console.log("6");

            //AVAILABLE CONTRACTS
            let contract = {
              contract_name: individContract.val().contractName,
              contract_details: individContract.val().contractDetails
            };
            available.push(contract);
          } else if (
            !individContract.val().available &&
            individContract.key !== "bids"
          ) {
            //NOT AVAILABLE CONTRACTS
            console.log("individ contract");
            console.log(individContract.val().assignedTo);
            let contract = {
              contract_name: individContract.val().contractName,
              contract_details: individContract.val().contractDetails,
              assigned_to: individContract.val().assignedTo
            };
            assigned.push(contract);
          }
        });
      });

      //this.setState( { allContracts: contractArr });
      this.setState({
        availableContracts: available,
        assignedContracts: assigned
      });
    });
  };

  viewBidsClicked = contract_name => {
    console.log("about to route to bids for: " + contract_name);
    this.props.history.push({
      pathname: "/viewbids",
      state: {
        contract_name: contract_name,
        company_name: this.state.companyName
      }
    });
  };

  updatePendingSearch = pending_search => {
    this.setState({ pending_search });
    console.log(pending_search);
  };

  updateAssignedSearch = assigned_search => {
    this.setState({ assigned_search });
    console.log(assigned_search);
  };

  render() {
    const classes = useStyles;

    return (
      <div className="Company-whole">
        <CompanyNavBar history={this.props.history} />
        <h1 className="dashboardHeader">{this.state.companyName}</h1>

        <div className="Student-Profile">
          <List>
            {/** Implemented a scrollbar */}
            <Card
              className="Student-studentholder"
              style={{
                minWidth: 400,
                maxWidth: 400,
                maxHeight: 300,
                overflow: "auto"
              }}
            >
              <div>
                <br />
                {this.state.email}
                <br />
                <br />
              </div>
            </Card>
          </List>
        </div>
        <div type="dashinfo">
          <List className="individual">
            <Card
              style={{
                margin: 5,
                minWidth: 400,
                maxWidth: 400,
                maxHeight: 800,
                overflow: "auto"
              }}
            >
              <div>
                <br />
                <b>Assigned Contracts</b>
              </div>
              <br />
              <Divider />
              <br />
              <div>
                <TextField
                  variant="outlined"
                  id="searchbar"
                  name="Search Assigned"
                  label="Search Assigned"
                  onChange={e => {
                    this.updateAssignedSearch(e.target.value);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    )
                  }}
                />
              </div>
              <CardContent>
                {this.state.assignedContracts.length == 0 ? (
                  <div style={{ fontSize: "18px" }}>
                    <br />
                    <br />
                    <br />
                    There are no assigned contracts{" "}
                  </div>
                ) : (
                  this.state.assignedContracts.map(itr => {
                    return itr.contract_name
                      .toLowerCase()
                      .includes(this.state.assigned_search.toLowerCase()) ||
                      itr.contract_details
                        .toLowerCase()
                        .includes(this.state.assigned_search.toLowerCase()) ||
                      this.state.assigned_search == "" ? (
                      <div key={itr.contract_details}>
                        <div
                          className="contract"
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "#3f51b5"
                          }}
                        >
                          {itr.contract_name}
                        </div>
                        <div style={{ fontSize: "18px" }}>
                          {itr.contract_details}{" "}
                        </div>
                        <div className="assignedTo">
                          {" "}
                          Assigned to: {itr.assigned_to}{" "}
                        </div>
                        <br />
                      </div>
                    ) : (
                      <div />
                    );
                  })
                )}
              </CardContent>
            </Card>
          </List>

          <List className="individual">
            <Card
              style={{
                margin: 5,
                minWidth: 400,
                maxWidth: 400,
                maxHeight: 800,
                overflow: "auto"
              }}
            >
              <div>
                <br />
                <b>Pending Contracts</b>
              </div>
              <br />
              <Divider />
              <br />
              <div>
                <TextField
                  variant="outlined"
                  id="searchbar"
                  name="Search Pending"
                  label="Search Pending"
                  onChange={e => {
                    this.updatePendingSearch(e.target.value);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    )
                  }}
                />
              </div>
              <CardContent>
                {this.state.availableContracts.length == 0 ? (
                  <div style={{ fontSize: "18px" }}>
                    <br />
                    <br />
                    <br />
                    There are no pending contracts{" "}
                  </div>
                ) : (
                  this.state.availableContracts.map(itr => {
                    return itr.contract_name
                      .toLowerCase()
                      .includes(this.state.pending_search.toLowerCase()) ||
                      itr.contract_details
                        .toLowerCase()
                        .includes(this.state.pending_search.toLowerCase()) ||
                      this.state.pending_searc == "" ? (
                      <div key={itr.contract_details}>
                        <div
                          className="contract"
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "#3f51b5"
                          }}
                        >
                          {itr.contract_name}
                        </div>
                        <div style={{ fontSize: "18px" }}>
                          {" "}
                          {itr.contract_details}{" "}
                        </div>
                        <Button
                          color="primary"
                          size="small"
                          variant="contained"
                          className={classes.button}
                          onClick={() =>
                            this.viewBidsClicked(itr.contract_name)
                          }
                          style={{ textTransform: "none" }}
                        >
                          See Bids{" "}
                        </Button>
                        <br />
                        <br />
                      </div>
                    ) : (
                      <div />
                    );
                  })
                )}
              </CardContent>
            </Card>
          </List>
        </div>
      </div>
    );
  }
}

export default CompanyHome;

//<Company_NavBar title={"Home"} />
