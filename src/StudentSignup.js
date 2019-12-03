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
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

class StudentSignup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      errorOccurred: false
    };
  }

  componentDidMount = () => {
    document.title = "RevTek";
  };

  //update the state when they enter information
  updateField(field, newValue) {
    this.setState({
      ...this.state,
      [field]: newValue
    });
  }

  doRegister = () => {
    var that = this;
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        // creation successful
        console.log("SUCCESS");

        const usersRef = firebase.database().ref("users"); //reference to the database "users" key
        const user = {
          //create thing to be pushed
          email: this.state.email,
          name: this.state.firstName + " " + this.state.lastName,
          type: "student",
          disabled: false
        };
        usersRef.push(user); //push the data to the database

        this.props.history.push("/studentdashboard");
      })
      .catch(function(error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;

        that.setState({
          errorOccurred: true
        });
      });
  };

  render() {
    const classes = useStyles;
    return (
      <div>
        <RevTekHomeNavBar history={this.props.history} />
        <div className="Landing-Body">
          <Card className="SignUp-Card">
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                {this.state.errorOccurred ? (
                  <p className="redP">
                    Unable to register. Please make sure you have not previously
                    registered your email and that your chosen password is 6
                    characters or longer.
                  </p>
                ) : (
                  <div />
                )}
                <div className="lockIcon">
                  <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                  </Avatar>
                </div>
                <Typography component="h1" variant="h5">
                  Sign up as a Student
                </Typography>
                <form className={classes.form} noValidate>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="fname"
                        name="firstName"
                        variant="outlined"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                        onChange={e =>
                          this.updateField("firstName", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="lname"
                        onChange={e =>
                          this.updateField("lastName", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        onChange={e =>
                          this.updateField("email", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={e =>
                          this.updateField("password", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid />
                  </Grid>

                  <Grid container justify="flex-end">
                    <Grid item>
                      {/* Make this redirect to Authentication.js */}
                      <Link href="/signin" variant="body2">
                        Already have an account? Sign in
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
                  onClick={() => this.doRegister()}
                >
                  Sign Up
                </Button>
              </div>
            </Container>
          </Card>
        </div>
      </div>
    );
  }
}
export default StudentSignup;
