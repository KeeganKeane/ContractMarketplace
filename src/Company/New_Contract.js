import React from "react";
import CompanyNavBar from "./Company_NavBar";
import firebase from "../firebase.js";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import "./Company.css"

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  dense: {
    marginTop: theme.spacing(2)
  },
  menu: {
    width: 200
  }
}));

class NewContract extends React.Component {
  state = {
    companyName: "",
    email: "",

    contractName: "",
    contractDetails: ""
  };

  componentDidMount() {
    document.title = "RevTek";
    //find the user and save the information
    let curEmail = "";
    var user = firebase.auth().currentUser;
    if (user !== null) {
      curEmail = user.email; // save the email we are looking for
      const usersRef = firebase.database().ref("users"); //reference to the database "users" key

      usersRef.on("value", snapshot => {
        //console.log( snapshot.val() )

        let info = [];
        snapshot.forEach(function(childSnapshot) {
          var item = childSnapshot.val();
          if (item.email === curEmail) {
            //if we've found the right folder
            info.push(item.name);
            info.push(item.email);
          }
        });
        this.setState({ companyName: info[0], email: info[1] });
      });
    } else {
      console.log("user not set up");
    }
  }


  updateField(field, newValue) {
    this.setState({
      ...this.state,
      [field]: newValue
    });
  }

  submitContract = () => {
    const contractRef = firebase
      .database()
      .ref(
        "contracts/" + this.state.companyName + "/" + this.state.contractName
      );
    const contract = {
      contractName: this.state.contractName,
      contractDetails: this.state.contractDetails,
      available: true,
      assignedTo: "", //when the contract is assigned, this field will hold the username of who it's assigned to
      name: this.state.companyName
    };
    contractRef.push(contract);

    this.props.history.push("/companydashboard");
  };

  render() {
    const classes = useStyles;
    return (
      <div className="Company-whole">
        <CompanyNavBar history={this.props.history} />
        <h1 className="dashboardHeader"> Submit a New Contract </h1>
        <h2>{this.state.companyName}</h2>
        <div> {this.state.email} </div>
        <br/>
        <div className="newContract"> 
        <Card
              style={{
                minWidth: 700,
                maxWidth: 400,
                maxHeight: 300,
                overflow: "auto"
              }}>
              <CardContent>
              <div> Here you can enter a project you need to have completed. 
                It would be useful to give it a memorable name and a description of the skills necessary to complete the task.
                Students will be able to view this information and bid on your contract. 
                You can then select the most appealing bid, and the student will be notified!
              </div>
              </CardContent>
            </Card>
        </div>
        <br/>
        <div className="newContract"> 
        <Card
              style={{
                minWidth: 700,
                maxWidth: 400,
                maxHeight: 300,
                overflow: "auto"
              }}>
              <CardContent>
                <form className={classes.container} noValidate autoComplete="off">
                  <TextField
                    label="Contract Name"
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                    onChange={e => this.updateField("contractName", e.target.value)}
                  />
                  <div>
                    <TextField
                      id="outlined-multiline-flexible"
                      label="Details"
                      multiline
                      rowsMax="10"
                      style={{ margin: 8 }}
                      helperText="Provide some more details about your contract"
                      margin="normal"
                      variant="outlined"
                      onChange={e =>
                        this.updateField("contractDetails", e.target.value)
                      }
                    />
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => this.submitContract()}
                  >
                    Submit contract!
                  </Button>
                </form>
              </CardContent>
            </Card>

            </div>


      </div>
    );
  }
}

export default NewContract;


