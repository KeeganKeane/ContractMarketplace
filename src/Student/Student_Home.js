import React from "react";
import List from "@material-ui/core/List";
import CardContent from "@material-ui/core/CardContent";
import StudentNavBar from "./Student_NavBar";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import firebase from "../firebase.js";
import "./Student_Home.css";
import { Button } from "@material-ui/core";

class StudentHome extends React.Component {
  state = {
    student_email: "",
    student_name: "",
    skill_arr: [],
    contract_arr: [],
    bid_arr: [],
    assigned_search: "",
    bid_search: ""
  };

  componentDidMount = () => {
    document.title = "RevTek";

    //Finds the users email through Firebase authentication
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("user is signed in");
        console.log(user.email);
        this.setState({ student_email: user.email });

        //get the pending bids and assigned contracts
        this.getBids(user.email);
        //get the skills
        this.getSkills();
      } else {
        // No user is signed in.
        console.log("Invalid Username or Password");
      }
    });

    //Finds the matching Name and Listed skills from Firebase
    const userRef = firebase.database().ref("users"); // access all users
    userRef.on("value", snapshot => {
      let users = snapshot.val();
      for (let itr in users) {
        if (this.state.student_email === users[itr].email) {
          // check for a user with a matching email
          this.setState({ student_name: users[itr].name });
          break;
        }
      }
    });
  };

  getSkills = () => {
    let temp = this.state.student_email;
    let temp_arr = [];
    //Finds the matching Name and Listed skills from Firebase
    this.setState({ skill_arr: [] });
    const userRef = firebase.database().ref("users"); // access all users
    userRef.on("value", snapshot => {
      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        //console.log("ITEM: " + item.email);
        if (temp === item.email) {
          // check for a user with a matching email
          if (item.skills !== undefined) {
            for (let itr2 in item.skills) {
              temp_arr.push(item.skills[itr2]);
            }
          }
        }
      });
      this.setState({ skill_arr: temp_arr });
    });
  };

  getBids = () => {
    console.log("going to get bids");
    let temp = this.state.student_email;
    let temp_bid = [];
    let available_con = [];
    //Finds the matching Name and Listed skills from Firebase
    const referenceUsers = firebase.database().ref("users"); // access all users
    referenceUsers.on("value", snapshot => {
      console.log(snapshot.val());
      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        //console.log("ITEM: " + item.email);
        if (temp === item.email) {
          console.log("found the folder");
          // check for a user with a matching email
          //Iterates through all of the items in the user
          if (item.bids !== undefined) {
            console.log("found bids");
            for (let itr in item.bids) {
              console.log(item.bids[itr].Accepted);
              if (item.bids[itr].Accepted === false) {
                temp_bid.push(item.bids[itr]);
              } else if (item.bids[itr].Accepted === true) {
                available_con.push(item.bids[itr]);
              }
            }
          }
        }
      });

      this.setState({ bid_arr: temp_bid, contract_arr: available_con });
    });
  };

  //Updates the state of assigned search
  updatingAssignedSearch = assigned_search => {
    this.setState({ assigned_search });
    console.log(assigned_search);
  };

  //Updates the state of bid search
  updatingBidSearch = bid_search => {
    this.setState({ bid_search });
    console.log(bid_search);
  };

  //Routes to edit profile when clicked
  editProfileClicked = e => {
    // Redirects to marketplace page
    return (window.location = "/editstudentprofile");
  };

  //The render method
  render() {
    return (
      <div className="Student-whole">
        <StudentNavBar history={this.props.history} />
        <h1>Dashboard</h1>

        <div className="Student-Profile">
          <List>
            {/** Implemented a scrollbar */}
            <Card
              className="Student-studentholder"
              style={{ maxHeight: 300, overflow: "auto" }}
            >
              <div>
                <b className="name">{this.state.student_name} </b>
                <Divider />
              </div>
              <CardContent>
                <div>
                  <b>Email:</b> {this.state.student_email}
                </div>
                <div>
                  <b>Listed Skills: </b>
                  {this.state.skill_arr.length === 0 ? (
                    <div> You have not entered any skills </div>
                  ) : (
                    this.state.skill_arr.map(itr => itr + ", ")
                  )}
                </div>
                <br />
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.editProfileClicked()}
                  >
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </List>
        </div>
        <br />
        <div className="Student-ContractBids">
          {/** Implemented a scrollbar */}
          <Card
            className="Student-contractholder"
            style={{ maxHeight: 200, overflow: "auto" }}
          >
            <div>
              <b>Current Contracts Assigned:</b>
              <Divider />
            </div>
            <div className="Student-Searchbarholder">
              <SearchIcon />
              <InputBase
                placeholder="Search Contracts Assigned"
                onChange={e => {
                  this.updatingAssignedSearch(e.target.value);
                }}
              />
            </div>
            <CardContent>
              {this.state.contract_arr.length === 0 ? (
                <div> You have no contracts yet </div>
              ) : (
                this.state.contract_arr.map(itr => {
                  return itr.Company.toLowerCase().includes(
                    this.state.assigned_search.toLowerCase()
                  ) ||
                    itr.Contract.toLowerCase().includes(
                      this.state.assigned_search.toLowerCase()
                    ) ||
                    itr.Cost.toString().includes(this.state.assigned_search) ||
                    itr.Details.toLowerCase().includes(
                      this.state.assigned_search.toLowerCase()
                    ) ||
                    itr.Hours.toLowerCase().includes(
                      this.state.assigned_search.toLowerCase()
                    ) ||
                    itr.Info.toLowerCase().includes(
                      this.state.assigned_search.toLowerCase()
                    ) ||
                    itr.Rate.toLowerCase().includes(
                      this.state.assigned_search.toLowerCase()
                    ) ||
                    itr.Company.toLowerCase().includes(
                      this.state.assigned_search.toLowerCase()
                    ) ? (
                    <div>
                      <b className="contract"> {itr.Contract} </b>
                      <div className="contractInfo">
                        {" "}
                        Company: {itr.Company}{" "}
                      </div>
                      <div className="contractInfo"> Cost: {itr.Cost} </div>
                      <div className="contractInfo"> Hours: {itr.Hours} </div>
                    </div>
                  ) : (
                    <div />
                  );
                })
              )}
            </CardContent>
          </Card>
          <Card
            className="Student-bidholder"
            style={{ maxHeight: 200, overflow: "auto" }}
          >
            <div>
              <b>Current Bids:</b>
              <Divider />
            </div>
            <div className="Student-Searchbarholder">
              <SearchIcon />
              <InputBase
                placeholder="Search Bids"
                onChange={e => {
                  this.updatingBidSearch(e.target.value);
                }}
              />
            </div>
            <CardContent>
              {this.state.bid_arr.length === 0 ? (
                <div> You have no bids yet </div>
              ) : (
                this.state.bid_arr.map(itr2 => {
                  return itr2.Company.toLowerCase().includes(
                    this.state.bid_search.toLowerCase()
                  ) ||
                    itr2.Contract.toLowerCase().includes(
                      this.state.bid_search.toLowerCase()
                    ) ||
                    itr2.Cost.toString()
                      .toLowerCase()
                      .includes(this.state.bid_search.toLowerCase()) ||
                    itr2.Details.toLowerCase().includes(
                      this.state.bid_search.toLowerCase()
                    ) ||
                    itr2.Hours.toString()
                      .toLowerCase()
                      .includes(this.state.bid_search.toLowerCase()) ||
                    itr2.Info.toLowerCase().includes(
                      this.state.bid_search.toLowerCase()
                    ) ||
                    itr2.Rate.toLowerCase().includes(
                      this.state.bid_search.toLowerCase()
                    ) ||
                    itr2.Company.toLowerCase().includes(
                      this.state.bid_search.toLowerCase()
                    ) ? (
                    <div>
                      <b className="contract"> {itr2.Contract} </b>
                      <div className="contractInfo">
                        {" "}
                        Company: {itr2.Company}{" "}
                      </div>
                      <div className="contractInfo"> Cost: {itr2.Cost} </div>
                      <div className="contractInfo"> Hours: {itr2.Hours} </div>
                    </div>
                  ) : (
                    <div> </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

export default StudentHome;
