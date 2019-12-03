import React from "react";
import MUIDataTable from "mui-datatables";
import AdminNavBar from "./Admin_NavBar";
import "./Admin_ManageUsers.css"
import firebase from "../firebase.js";


export default class AdminManageUsers extends React.Component {
  state = {
    initialized: false,
    emails: [],
    names: [],
    types: []
  };

  componentDidMount() {
    document.title = "RevTek";
    let newEmails = [];
    let newNames = [];
    let newTypes = [];

    if (!this.state.initialized) {
      const usersRef = firebase.database().ref("users"); //reference to the database "users" key
      usersRef.on("value", snapshot => {
        snapshot.forEach(usersSnapshot => {
          var userField = usersSnapshot.val();

          if( userField.disabled === false ){
            newEmails.push(userField.email);
            newNames.push(userField.name);
            newTypes.push(userField.type);
  
            this.setState({
              emails: newEmails,
              names: newNames,
              types: newTypes
            });
          }

        });
      });
      this.setState({ initialized: true });
    }
  }

  deleteClicked = deletedRows => {
    // figure out which rows were deleted
    const deletedIndexes = Object.keys(deletedRows.lookup);
    //console.log( deletedIndexes )

    //find which user the indices refer to and remove it
    for (let i = 0; i < deletedIndexes.length; i++) {
      console.log(deletedIndexes[i]);
      let email =  this.state.emails[ deletedIndexes[i] ]; 
      let name = this.state.names[ deletedIndexes[i] ];
      let type = this.state.types[ deletedIndexes[i] ]
      console.log( email + " " + name )

      // 1) change disabled to true
      const userRef =  firebase.database().ref( "users/")
      userRef.on("value", snapshot => {
        snapshot.forEach(function(user) {
          //console.log( user.val() )
          let userKey = user.key;
          if( user.val().email === email && user.val().name === name ) {
            console.log( "found")
            //UPDATE DISABLED TO TRUE
            firebase.database().ref(  "users/" + userKey + "/disabled").set( true )
          }
        })
      })

      
      // 2) IF ITS A STUDENT loop through every bid in every contract, if it belongs to that user delete it
      if( type === "student" ){
        var contractsRef = firebase.database().ref( "contracts/")
        contractsRef.on("value", snapshot => {
          snapshot.forEach( function(company){
            let compKey = company.key
            //console.log( company.val() )
            company.forEach( function( contract ){
              let contKey = contract.key
              //console.log( contract.val())
              contract.forEach( function(folder){
                if( folder.key === "bids" ){
                  //console.log( "found bids folder")
                  folder.forEach( function( individBid ){
                    let bidKey = individBid.key
                    
                    if( individBid.val().Student === email ){
                      //console.log( individBid.val() )
                      console.log( "found " + email + "'s bids")

                      // 3) if the bid was accepted, change the contract to "available"
                      if( individBid.val().Accepted ){
                        console.log( "IT WAS ACCEPTED" + compKey + " " + contKey)

                        let refString = "contracts/" + compKey + "/" + contKey;
                        const contractsRef = firebase.database().ref(refString);
                        contractsRef.on("value", snapshot => {
                          console.log( snapshot.val() )
                          let count = 1; //use this variable to only access the FIRST thing
                          snapshot.forEach(function(childSnapshot) {
                            if (count === 1) {
                              //UPDATE
                              firebase.database().ref(refString + "/" + childSnapshot.key + "/available").set(true); //mark it not available
                              firebase.database().ref(refString + "/" + childSnapshot.key + "/assignedTo").set("");
                            }
                            count++;
                          });
                        });
                           
                      }else{
                        console.log( "it was not accepted")
                      }

                      var toDeleteBidRef = firebase.database().ref( "contracts/" + compKey + "/" + contKey + "/bids/" + bidKey )
                      toDeleteBidRef.remove() //remove the bids
                    }
                    
                  })
                } 
              })
  
            })
          })
        })
      }

      // 2.5) IF ITS A COMPANY delete all it's contracts
      if( type === "company" ){
        var contractsRef = firebase.database().ref( "contracts/" )
        contractsRef.on("value", snapshot => {
          console.log( snapshot.val() )
          snapshot.forEach( function( company ){
            let compKey = company.key
            if( name === compKey ){
              console.log( "found folder")
              var toDeleteContracts = firebase.database().ref( "contracts/" + compKey )
              //toDeleteContracts.remove() //remove their contracts folder
            }
          })
        })
      }

     
      // 4) add some way for the company to know why their contract became available 
    }
    window.location.reload();
  };
 



  
  render() {
    const columns = ["Name", "User Type", "Email"];

    const data = [];
    for (var i = 0; i < this.state.names.length; i++) {
      data.push([
        this.state.names[i],
        this.state.types[i],
        this.state.emails[i]
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
        <h1 className="dashboardHeader">Manage Users</h1>
        <br/>
        <div >
          <MUIDataTable
            title={"Users"}
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}
