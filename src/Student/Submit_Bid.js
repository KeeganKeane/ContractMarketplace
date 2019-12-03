import React from "react";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import firebase from "../firebase.js";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import StudentNavBar from "./Student_NavBar";
import "./Submit_Bid.css";
import CardActionArea from "@material-ui/core/CardActionArea";

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
  constructor(props) {
    super(props);

    this.state = {
      bidRate: 0,
      bidHours: 0,
      bidTotalCost: 0,
      otherInfo: "",
      matchFound: false,
      stateKey: "",
      theBid: [],
      counter: 0
    };
  }

  componentDidMount = () => {
    document.title = "RevTek";
  };

  updateField(field, newValue) {
    this.setState({
      ...this.state,
      [field]: newValue
    });
    console.log(newValue);
  }

  // When the submit button is clicked, the bid is processed and stored in firebase, and then
  // the page redirects to the student dashboard
  whenClicked = async () => {
    this.submitBid();
    this.props.history.push({
      pathname: "/studentdashboard"
    });
  };

  // When a bid is submitted, it needs to be stored in two places in firebase
  // 1) Under the contract on which the bid was placed
  // 2) Under the user who placed the bid
  submitBid = async () => {
    let costOfBid = this.state.bidRate * this.state.bidHours;
    let matchingKey = "";
    let newBid = [];
    let counter = 0;

    await firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // Construct bid object
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

        // Find user to add to
        const usersRef = firebase.database().ref("users");
        usersRef.on("value", snapshot => {
          // loop through all users
          snapshot.forEach(tempUser => {
            // Check if the loop user's email matches the email of the user who submitted the bid
            if (tempUser.val().email === user.email) {
              counter++;
              matchingKey = tempUser.key;

              // Only add to firebase the first time the user is found (prevents an infinite loop)
              if (counter == 1) {
                if (matchingKey.length > 0) {
                  // Add bid to firebase under appropriate user
                  const matchingUserRef = firebase
                    .database()
                    .ref("users/" + matchingKey + "/bids");
                  matchingUserRef.push(newBid);
                  console.log("WORKING PROPERLY!!!!!");
                } else {
                  console.log("NOT WORKING PROPERLY = " + matchingKey);
                }
              }
            }
          });
        });
      } else {
        // No user is signed in.
        console.log("Invalid Username or Password");
      }
    });
  };

  render() {
    const classes = useStyles;

    return (
      <div className="whole">
        <StudentNavBar history={this.props.history} />
        <h1 className="dashboardHeader">Submit a Bid</h1>
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


          <Card raised className={classes.card}>
                <CardContent>
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

                        <Grid item xs={12} sm={10}>
                          <p>
                            {this.state.bidHours && this.state.bidRate
                              ? "Total Bid Amount: $" +
                                this.state.bidHours * this.state.bidRate
                              : "Enter details above to calculate bid total"}
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
                    <br/>
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
                </CardContent>
            </Card>






          </div>
        </div>
      </div>
    );
  }
}

export default Submit_Bid;



