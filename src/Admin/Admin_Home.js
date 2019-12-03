import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import "./Admin_Home.css";
import AdminNavBar from "./Admin_NavBar";
import firebase from "../firebase.js";

class AdminHome extends React.Component {
  state = {
    studentCount: 0,
    companyCount: 0,

    assignedCount: 0,
    availableCount: 0
  };

  componentDidMount() {
    document.title = "RevTek";
    //get all the statistics
    const usersRef = firebase.database().ref("users"); //reference to the database "users" key
    /// GET NUMBERS OF USERS
    usersRef.on("value", snapshot => {
      //console.log( snapshot.val() )
      let studCount = 0;
      let compCount = 0;

      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        //console.log( item )
        if (item.type === "student") {
          studCount++;
        } else if (item.type === "company") {
          compCount++;
        }
      });
      this.getContractsStats(studCount, compCount);
    });
  }

  getContractsStats = (studCount, compCount) => {
    const contractsRef = firebase.database().ref("contracts"); //reference to the database "users" key
    // GET NUMBERS OF CONTRACTS
    contractsRef.on("value", snapshot => {
      //console.log( snapshot.val() )
      let numAssigned = 0;
      let numAvailable = 0;
      snapshot.forEach(function(company) {
        //console.log( company.val() )
        company.forEach(function(contract) {
          //console.log( contract.val() )
          let count = 0;
          contract.forEach(function(individContract) {
            if (count === 0) {
              //console.log( individContract.val().available )
              if (individContract.val().available) {
                numAvailable++;
              } else {
                numAssigned++;
              }
            }
            count++;
          });
        });
      });

      this.setState({
        assignedCount: numAssigned,
        availableCount: numAvailable,
        studentCount: studCount,
        companyCount: compCount
      });
    });
  };

  render() {
    return (
      <div className="Admin-dash-whole">
        <AdminNavBar history={this.props.history} />
        <h1 className="dashboardHeader">Admin Dashboard</h1>
        <br />
        <br />
        <div className="Admin-Cards">
          <Card className="Admin-header">
            <div>
              <b> Number of Student Users: </b>
            </div>
            <CardContent className="Admin-Content">
              {this.state.studentCount}
              <div />
            </CardContent>
          </Card>
          <Card className="Admin-header">
            <div>
              <b> Number of Company Users: </b>
            </div>
            <CardContent className="Admin-Content">
              {this.state.companyCount}
              <div />
            </CardContent>
          </Card>
          <Card className="Admin-header">
            <div>
              <b> Number of Assigned Contracts: </b>
            </div>
            <CardContent className="Admin-Content">
              {this.state.assignedCount}
              <div />
            </CardContent>
          </Card>
          <Card className="Admin-header">
            <div>
              <b> Number of Pending Contracts:</b>
            </div>
            <CardContent className="Admin-Content">
              {this.state.availableCount}
              <div />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

export default AdminHome;
