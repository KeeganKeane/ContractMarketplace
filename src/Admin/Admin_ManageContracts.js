import React from "react";
import MUIDataTable from "mui-datatables";
import AdminNavBar from "./Admin_NavBar";
import firebase from "../firebase.js";
import "./Admin_ManageUsers.css"

export default class AdminManageContracts extends React.Component {
  state = {
    initialized: false,
    companyNames: [],
    contractTitles: [],
    contractDetails: [],
    areAvailable: []
  };

  componentDidMount() {
    document.title = "RevTek";
    if (!this.state.initialized) {
      const contractsRef = firebase.database().ref("contracts"); //reference to the database "contracts" key

      contractsRef.on("value", snapshot => {
        snapshot.forEach(contractsSnapshot => {
          contractsSnapshot.forEach(detailsSnapshot => {
            detailsSnapshot.forEach(async contractFieldsSnapshot => {
              var contractField = contractFieldsSnapshot.val();
              if (!(contractField === "bids")) {
                let newNames = this.state.companyNames;
                let newTitles = this.state.contractTitles;
                let newDetails = this.state.contractDetails;
                let newAvailable = this.state.areAvailable;

                newNames.push(contractField.name);
                newTitles.push(contractField.contractName);
                newDetails.push(contractField.contractDetails);
                if (contractField.available === true) {
                  newAvailable.push("Yes");
                } else if (contractField.available === false) {
                  newAvailable.push("No");
                }

                await this.setState({
                  companyNames: newNames,
                  contractTitles: newTitles,
                  contractDetails: newDetails,
                  areAvailable: newAvailable
                });
              }
            });
          });
        });
      });
      this.setState({ initialized: true });
    }
  }

  deleteClicked = deletedRows => {
    // figure out which rows were deleted
    const deletedIndexes = Object.keys(deletedRows.lookup);
    //console.log( deletedIndexes )

    //find which contract name they refer to and remove it
    for (let i = 0; i < deletedIndexes.length; i++) {
      //console.log( deletedIndexes[i] )
      let compName = this.state.companyNames[deletedIndexes[i]];
      let contractName = this.state.contractTitles[deletedIndexes[i]];
      //console.log( "deleting " + compName + " " + contractName )
      var contractRef = firebase
        .database()
        .ref("contracts/" + compName + "/" + contractName);
      contractRef.remove(); //actually remove it
    }

    //remove all bids that pertain to that contract
    for (let i = 0; i < deletedIndexes.length; i++) {
      let compName = this.state.companyNames[deletedIndexes[i]];
      let contractName = this.state.contractTitles[deletedIndexes[i]];
      console.log("deleting bids for " + compName + " " + contractName);
      var usersRef = firebase.database().ref("users/");
      usersRef.on("value", snapshot => {
        //console.log( snapshot.val() )
        snapshot.forEach(function(user) {
          if (user.val().bids !== undefined) {
            let userKey = user.key;
            //console.log( user.val())
            user.forEach(function(folder) {
              if (folder.key === "bids") {
                //console.log( folder.val() )
                folder.forEach(function(individBid) {
                  console.log(individBid.val().Contract);
                  if (individBid.val().Contract === contractName) {
                    let bidKey = individBid.key;
                    console.log("found the bid! Going to delete it...");
                    var toDeleteBidRef = firebase
                      .database()
                      .ref("users/" + userKey + "/bids/" + bidKey);
                    toDeleteBidRef.remove(); //remove all bids
                  }
                });
              }
            });
          }
        });
      });
    }

    //RELOAD THE PAGE
    window.location.reload();
  };

  render() {
    const columns = [
      "Company",
      "Contract Title",
      "Contract Details",
      "Available"
    ];

    const data = [];
    for (var i = 0; i < this.state.companyNames.length; i++) {
      data.push([
        this.state.companyNames[i],
        this.state.contractTitles[i],
        this.state.contractDetails[i],
        this.state.areAvailable[i]
      ]);
    }

    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      onRowsDelete: this.deleteClicked
    };

    return (
      <div className="Admin-users-whole">
        <AdminNavBar history={this.props.history} />
        <h1 className="dashboardHeader">Manage Contracts</h1>
        <br/>
        <div>
          <MUIDataTable
            title={"Contracts"}
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}
