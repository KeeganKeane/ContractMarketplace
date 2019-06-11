import React from "react";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Admin_NavBar from "../Admin/Admin_NavBar";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import firebase from "../firebase.js";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Student_NavBar from "./Student_NavBar";
import "./Submit_Bid.css";
import CardActionArea from "@material-ui/core/CardActionArea";
import { async } from "q";

const useStyles = makeStyles({
  card: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

class Submit_Bid extends React.Component {
  // In marketplace, want to show all contracts with status of available
  // Also want search bar to refine results
  // Each contract needs a "Submit Bid" button, which will take user to new page where they can enter
  //    bid details for that specific contract

  constructor(props) {
    super(props);

    this.state = {
      bidRate: 0,
      bidHours: 0,
      bidTotalCost: 0,
      otherInfo: ""
    };
  }

  componentDidMount = () => {
    console.log("SUBMITBIDKEY = " + this.props.location.state.key);
    console.log("Company " + this.props.location.state.company);
    console.log("Contract " + this.props.location.state.contract);
    console.log("Details " + this.props.location.state.details);
  };

  updateField(field, newValue) {
    this.setState({
      ...this.state,
      [field]: newValue
    });
    console.log(newValue);
  }

  whenClicked = async () => {
    await this.submitBid();
    this.props.history.push({
      pathname: "/studentdashboard"
    });
  };

  submitBid = async () => {
    let costOfBid = this.state.bidRate * this.state.bidHours;
    let matchingKey = "";
    let newBid = [];

    await firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("user ====" + user.email);
        console.log("userkey === " + user.key);
        // student is signed in, do stuff
        newBid = {
          Student: user.email,
          Company: this.props.location.state.company,
          Contract: this.props.location.state.contract,
          Details: this.props.location.state.details,
          Rate: this.state.bidRate,
          Hours: this.state.bidHours,
          Cost: costOfBid,
          Info: this.state.otherInfo,
          Accepted: false
        };

        // Add bid under the appropriate contact in firebase
        const contractRef = firebase
          .database()
          .ref(
            "contracts/" +
              this.props.location.state.company +
              "/" +
              this.props.location.state.contract +
              "/bids"
          );
        contractRef.push(newBid);

        // Add bid under the appropriate user in firebase
        const usersRef = firebase.database().ref("users");
        usersRef.on("value", snapshot => {
          // loop through all users
          snapshot.forEach(function(tempUser) {
            // loop through each contract
            console.log("loop user email = " + tempUser.val().email);
            console.log("loop user key = " + tempUser.key);

            if (tempUser.val().email == user.email) {
              console.log("MATCH! Email" + tempUser.val().email);
              console.log("MATCH! Key" + tempUser.key);
              matchingKey = tempUser.key;
            }
          });
        });

        if (matchingKey.length > 0) {
          console.log("MATCHINGKEY = " + matchingKey);

          const matchingUserRef = firebase
            .database()
            .ref("users/" + matchingKey + "/bids");
          matchingUserRef.push(newBid);
          console.log("WORKING PROPERLY!!!!!");
        } else {
          console.log("MATCHINGKEY = " + matchingKey);
        }
      } else {
        // No user is signed in.
        console.log("Invalid Username or Password");
      }
    });
  };

  render() {
    const classes = useStyles;

    return (
      <div>
        <Student_NavBar title={"Submit Bid"} />
        <div className="everything">
          <div className="bidCard">
            <Card raised className={classes.card}>
              <CardActionArea>
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    {this.props.location.state.company}
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {this.props.location.state.contract}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {this.props.location.state.details}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions />
            </Card>
            <br />
          </div>

          <div>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <form noValidate>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="filled-number"
                      name="hourlyRate"
                      label="Hourly Rate"
                      onChange={e =>
                        this.updateField("bidRate", e.target.value)
                      }
                      type="number"
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="hours"
                      name="hours"
                      label="Hours to Complete"
                      onChange={e =>
                        this.updateField("bidHours", e.target.value)
                      }
                      type="number"
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={20} sm={10}>
                    <p>
                      {this.state.bidHours && this.state.bidRate
                        ? "Total Cost of Bid: $" +
                          this.state.bidHours * this.state.bidRate
                        : "Enter details above to calculate total cost"}
                    </p>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      name="info"
                      label="Other Information"
                      id="info"
                      autoComplete="info"
                      onChange={e =>
                        this.updateField("otherInfo", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid />
                </Grid>
              </form>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                // className={classes.submit}
                onClick={() => this.whenClicked()}
              >
                Submit Bid
              </Button>
            </Container>
          </div>
        </div>
      </div>
    );
  }
}

export default Submit_Bid;
