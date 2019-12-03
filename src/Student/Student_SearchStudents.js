import React from "react";
import MUIDataTable from "mui-datatables";
import StudentNavBar from "./Student_NavBar";
import firebase from "../firebase";
import "./Student_Home.css";

export default class StudentSearchStudents extends React.Component {
  state = {
    initialized: false,
    studentNames: [],
    emails: [],
    bios: [],
    skills: [],
    individualSkills: []
  };

  componentDidMount() {
    document.title = "RevTek";

    let newNames = [];
    let newEmails = [];
    let newBios = [];
    let newSkills = [];

    if (!this.state.initialized) {
      const usersRef = firebase.database().ref("users"); //reference to the database "users" key
      usersRef.on("value", snapshot => {
        snapshot.forEach(userSnapshot => {
          var user = userSnapshot.val();
          if (user.type === "student") {
            newNames.push(user.name);
            newEmails.push(user.email);
            let key = userSnapshot.key;

            const studentRef = firebase.database().ref("users/" + key);
            studentRef.on("value", snapshot => {
              var user = snapshot.val();
              var bioObject = user.bio;
              var skillsObject = user.skills;

              if (bioObject !== undefined) {
                // console.log(bioObject);
                newBios.push(bioObject);
              }

              if (skillsObject !== undefined) {
                // console.log(skillsObject);
                newSkills.push(skillsObject);
              }
            });
          }
        });
        this.setState({
          studentNames: newNames,
          emails: newEmails,
          bios: newBios,
          skills: newSkills
        });
      });
      this.setState({ initialized: true });
    }
  }

  render() {
    const columns = ["Name", "Email", "Bio", "Skills"];

    const data = [];
    for (var i = 0; i < this.state.studentNames.length; i++) {
      var row = [];
      row.push(this.state.studentNames[i]);
      row.push(this.state.emails[i]);
      if (this.state.bios[i] === undefined) {
        row.push("N/A");
      } else {
        var fullBio = [];
        var bioLines = this.state.bios[i];
        Object.keys(bioLines).forEach(key => {
          let val = bioLines[key];
          fullBio.push(val, <br />);
        });
        row.push(fullBio);
      }
      if (this.state.skills[i] === undefined) {
        row.push("N/A");
      } else {
        var allSkills = [];
        var skillList = this.state.skills[i];
        Object.keys(skillList).forEach(key => {
          let val = skillList[key];
          allSkills.push(val, <br />);
        });
        row.push(allSkills);
      }
      data.push(row);
    }

    const options = {
      filterType: "dropdown",
      responsive: "scroll"
    };

    return (
      <div className="Student-whole">
        <StudentNavBar history={this.props.history} />
        <h1 className="dashboardHeader">Student Community</h1>
        <br/>
        <div>
          <MUIDataTable
            title={"Students"}
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    );
  }
}
