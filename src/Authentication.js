import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import firebase from "./firebase.js";
import RevTekHomeNavBar from "./RevTekHomeNavBar";
import Card from "@material-ui/core/Card";
import "./Landing.css";
import "./StudentSignup.css";

require("firebase/auth");

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

class Authentication extends React.Component {
  state = {
    email: "",
    password: "",
    errorOccurred: false,
    acctDeleted: false
  };

  componentDidMount = () => {
    document.title = "RevTek";
  };

  //change state as user inputs something
  changeEmail = text => {
    this.setState({ email: text });
  };
  //change state as user inputs something
  changePassword = text => {
    this.setState({ password: text });
  };

  signUp = () => {
    let route = this.props.history;
    route.push("/signUp");
  };

  onSignIn = () => {
    let that = this;
    console.log("here");

    ///// MAKE IT SO IT FINDS THE TYPE AND ROUTES TO THAT HOME PAGE
    let curEmail = this.state.email;
    let route = this.props.history;
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        // sign in successful
        console.log("SIGN IN SUCCESS");
        //find what kind of account it is
        const usersRef = firebase.database().ref("users"); //reference to the database "users" key
        usersRef.on("value", snapshot => {
          //console.log( snapshot.val() )

          snapshot.forEach(function(childSnapshot) {
            var item = childSnapshot.val();
            if (item.email === curEmail) {
              if (item.disabled === true) {
                that.setState({
                  acctDeleted: true,
                  errorOccurred: false
                });

                ////DONT LET THEM LOG IN
                console.log("this account has been deleted");
              } else if (item.type === "student") {
                route.push("/studentdashboard");
              } else if (item.type === "company") {
                route.push("/companydashboard");
              } else if (item.type === "admin") {
                route.push("/admindashboard");
              }
            }
          });
        });
      })
      .catch(function(error) {
        // Handle Errors here.
        console.log("there was an error");
        that.setState({
          errorOccurred: true,
          acctDeleted: false
        });
      });
  };

  render() {
    const classes = useStyles;

    return (
      <div className="App">
        <RevTekHomeNavBar history={this.props.history} />
        <div className="Landing-Body">
          <Card className="SignUp-Card">
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                {this.state.errorOccurred ? (
                  <p className="redP">
                    Unable to login. Please make sure your password matches the
                    email you have entered. If you do not have an account,
                    please register.
                  </p>
                ) : (
                  <div />
                )}
                {this.state.acctDeleted ? (
                  <p className="redP">
                    This account has been deleted. Contact the site admin for
                    more information.
                  </p>
                ) : (
                  <div />
                )}
                <div className="lockIcon">
                  <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                  </Avatar>
                </div>
                <Typography component="h1" variant="h5" color="black">
                  Sign in
                </Typography>
                <form className={classes.form} noValidate>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={e => this.changeEmail(e.target.value)}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={e => this.changePassword(e.target.value)}
                  />
                  <Grid container>
                    <Grid item>
                      <Link
                        href="#"
                        variant="body2"
                        onClick={() => this.signUp()}
                      >
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                </form>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={() => this.onSignIn()}
                >
                  Sign In
                </Button>
              </div>
            </Container>
          </Card>
        </div>
      </div>
    );
  }
}

export default Authentication;
