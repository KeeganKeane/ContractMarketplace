import React from "react";
import List from "@material-ui/core/List";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import SearchIcon from "@material-ui/icons/Search";
import Delete from "@material-ui/icons/Delete";
import IconButton from '@material-ui/core/IconButton';
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import firebase from "../firebase.js";
import "./Student_EditProfile.css";
import StudentNavBar from "./Student_NavBar";

class Student_EditProfile extends React.Component {
  state = {
    student_email: "",
    student_name: "",
    skill: "",
    skill_arr: [],
    bio: "", 
    biofeedback: false, 
  };

  async componentDidMount() {
    document.title = "RevTek";

    //Finds the users email through Firebase authentication
  firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("user is signed in");
        console.log(user.email);
        this.setState({ student_email: user.email });
      } else {
        // No user is signed in.
        console.log("Invalid Username or Password");
      }
    });

    //Finds the matching Name and Listed skills from Firebase and sets the skills array 
    this.setState({ skill_arr: [] });
    const userRef = firebase.database().ref("users"); // access all users
    userRef.on("value", snapshot => {
      let users = snapshot.val();
      let temp_arr = [];
      for (let itr in users) {
        if (this.state.student_email === users[itr].email)
        {
          // check for a user with a matching email
          this.setState({ student_name: users[itr].name });
          if (users[itr].skills !== undefined) 
          {
            for (let itr2 in users[itr].skills) 
            {
              temp_arr.push(users[itr].skills[itr2]);
            }
           // this.setState({ skill_arr: temp_arr });
          }
          this.setState({ skill_arr: temp_arr });
          break;
        }
      }
    });
    console.log("In Component Did Mount")

  //Get the Bio from Firebase 

   // Finds the matching Name and Listed skills from Firebase
    const userObj = firebase.database().ref("users"); // access all users
    userObj.on("value", snapshot => {
      let users_snap = snapshot.val();
      for (let itr in users_snap) {
        if (this.state.student_email === users_snap[itr].email) {
          // check for a user with a matching email
          if (users_snap[itr].bio !== undefined) {
            for (let itr2 in users_snap[itr].bio) {
              this.setState({ bio: users_snap[itr].bio[itr2] });
            }
          }
          break;
        }
      }
    });

  }


  //Adds skill to the users profile in firebase
  addSkill(e) {
    console.log("adding skill");
    e.preventDefault()
    //this.state.skill_arr.push(this.state.skill);
    this.updateFirebase();
    //this.getSkills();
    this.setState({skill: ""})
  }

  //Adds a new skill to firebase
  updateFirebase = () => {
    this.setState({skill_arr : []})
    let currentUser = firebase.auth().currentUser;
    console.log(currentUser);
    console.log(currentUser.email);
    const email_id = currentUser.email;
    console.log(this.state.activity);

    var usersRef = firebase.database().ref("/users");
    console.log(usersRef);
    let userID = "";
  //  let log = [];
    usersRef.on("value", snapshot => {
      let users = snapshot.val();
      console.log(users);
      for (let user in users) {
        if (email_id === users[user].email) {
          console.log(user);
          userID = user;
       //   log = users[user].skills;
        }
      }
    });
    var logRef = firebase.database().ref(`/users/${userID}/skills/`);
    console.log(logRef);
    logRef.push(this.state.skill);
  };

  //Removes Skill from firebase and the list
  removeSkill(e, delete_skill) {
    e.preventDefault()
    const userRef = firebase.database().ref("users"); // access all users
    userRef.on("value", snapshot => {
      let users = snapshot.val();
      // let keys = snapshot.key();
      for (let itr in users) {
        if (this.state.student_email === users[itr].email) {
          // check for a user with a matching email
          for (let itr2 in users[itr].skills) {
            if (users[itr].skills[itr2] === delete_skill) {
              console.log("The key for " + delete_skill);
              console.log(itr2);
              firebase
                .database()
                .ref("users")
                .child(itr)
                .child("skills")
                .child(itr2)
                .remove();
            }
          }
          break;
        }
      }
    });
    //this.setState({skill_arr : []})
   // this.getSkills();
  }

  //Updates the state of skill everytime the add skill input box changes
  updatingSkill = skill => {
    this.setState({ skill });
  };


//Pushes the bio data to firebase 
saveBio(e) {
  e.preventDefault()
this.setState({biofeedback : true})
    console.log("adding bio");
    let currentUser = firebase.auth().currentUser;
    console.log(currentUser);
    console.log(currentUser.email);
    const email_id = currentUser.email;
    console.log(this.state.activity);

    var usersRef = firebase.database().ref("/users");
    console.log(usersRef);
    let userID = "";
    let log = [];
    usersRef.on("value", snapshot => {
      let users = snapshot.val();
      console.log(users);
      for (let user in users) {
        if (email_id === users[user].email) {
          console.log(user);
          userID = user;
          log = users[user].bio;
        }
      }
    });
    var logRef = firebase.database().ref(`/users/${userID}/bio/`);
    console.log(logRef);
    logRef.push(this.state.bio);
  }

//Handles a change in the bio text and sets it to state 
  handleChange=(e)=>
  {
    e.preventDefault() 
    this.setState({bio : e.target.value})
  }

    render()
    {
        return (
          <div className= 'StudentEdit-whole'>

            <StudentNavBar  history={this.props.history} />

           <div className = 'StudentEdit-Profile'>
               <h1 className="dashboardHeader">Edit Your Profile</h1>
               <List>
                   {/** Implemented a scrollbar */}
               <Card className='StudentEdit-studentholder' style={{maxHeight: 300, overflow: 'auto'}}> 
                   <div>
                       <b>
                        {this.state.student_name}
                       </b>
                       <Divider/>
                   </div>
                   <CardContent>
                        <div>
                            <b>Email:</b> {this.state.student_email}
                        </div>
                   </CardContent>     
               </Card>   
               </List>
       
           </div>
           <div className = 'StudentEdit-ContractBids'>
               {/** Implemented a scrollbar */}
               <Card className='StudentEdit-contractholder' style={{maxHeight: 200, overflow: 'auto'}}> 
                   <div>
                    <b>
                        Add/Remove Skills
                    </b>
                   <Divider/>
                   </div>
                   <div className = "StudentEdit-Searchbarholder">
                       <SearchIcon />
                       <InputBase 
                       placeholder="Add Skill"
                       onChange={(skill)=>{this.updatingSkill(skill.target.value)}}
                       />
                        <Button variant="contained" color="primary" onClick={(e)=>this.addSkill(e)}>Add</Button>
                   </div>
                   <CardContent> 
                     <List>
                     {this.state.skill_arr.length > 0 ? this.state.skill_arr.map((itr) =><div key={itr}>{itr}<IconButton onClick={(e)=>this.removeSkill(e, itr)}><Delete/></IconButton></div>) : "You have no entered skills"}
                     </List>
                      
                   
                   </CardContent>
               
               </Card>   
               <Card className='StudentEdit-bidholder' style={{maxHeight: 200, overflow: 'auto'}}> 
                   <div>
                    <b>
                        Bio:
                    </b>
                   <Divider/>
                   </div>
                   <div className = "StudentEdit-Searchbarholder">
                   <TextField
                        id="outlined-multiline-flexible"
                        label="Current Bio"
                        multiline
                        rows="24"
                        value={this.state.bio}
                        onChange={(e)=>this.handleChange(e)}
                        //className={classes.textField}
                        margin="normal"
                        helperText="Be sure to save your edits"
                        variant="outlined"
                        width="100"
                    />
                    <div>
                    <Button variant="contained" color="primary" onClick={(e)=>this.saveBio(e)}>Save</Button>
                    </div>
                
                   </div>
                   {this.state.biofeedback ? "Saved!" : ""}
                   <CardContent>
                   
                   </CardContent>
               
               </Card>  
             
           </div>
   </div>
          );
    }
}

export default Student_EditProfile;
