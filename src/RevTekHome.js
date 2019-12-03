import React from "react";
import Card from "@material-ui/core/Card";
import RevTekHomeNavBar from "./RevTekHomeNavBar";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import "./RevTekHome.css";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  }
}));

class RevTekHome extends React.Component {
  componentDidMount() {}

  joinClicked() {
    return (window.location = "/signUp");
  }

  signUpStudClicked = e => {
    // Redirects to profile page
    this.props.history.push("/signupstudent");
  };

  signUpCompClicked = e => {
    // Redirects to profile page
    this.props.history.push("/signupcompany");
  };

  render() {
    const classes = useStyles;
    return (
      <div className="RevTekHome-Entire">
        <RevTekHomeNavBar history={this.props.history} />
        <div className="RevTekHome-Header">
          <Container maxWidth="xl">
            <Typography
              style={{
                fontSize: "calc(35px + 2vmin)",
                fontWeight: "bold",
                backgroundColor: "transparent",
                color: "#FFFFFF",
                textTransform: "none",
                boxShadow: "none"
              }}
            >
              Welcome to RevTek
            </Typography>
          </Container>
        </div>
        <div className="RevTekHome-Body">
          <br />
          <Container maxWidth="md">
            <Card
              className="RevTekHome-Info"
              style={{
                overflow: "auto",
                opacity: 0.97
              }}
            >
              <div className="RevTekHome-Title" style={{ color: "#282828" }}>
                <b>About Us</b>
              </div>
              <Divider />
              <br />
              <div
                className="RevTekHome-CardText"
                style={{ fontSize: "18px", color: "#282828" }}
              >
                Here at RevTek we are dedicated to connecting companies and
                students in order to foster both individual, community and
                company growth. By joining our community you will include
                yourself in an opportunity filled network of highly capabable
                and skilled proffesionals.
              </div>
            </Card>
          </Container>
          <br />
          <div className="RevTekHome-ServiceCards">
            <Container maxWidth="md">
              <Card
                className="RevTekHome-StudentCard"
                style={{
                  maxHeight: 600,
                  // maxWidth: 100,
                  overflow: "auto",
                  paddingLeft: "30px",
                  paddingRight: "30px",
                  opacity: 0.97,
                  color: "#282828"
                }}
              >
                <div className="RevTekHome-Title">
                  <b>For Students</b>
                </div>
                <Divider />
                <br />
                <div>
                  <div
                    className="RevTekHome-CardText"
                    style={{ fontSize: "18px", color: "#282828" }}
                  >
                    Registering as a Student within RevTek will open countless
                    oportunities for you to grow. Registering will give you the
                    ability to connect with any other students registered
                    students within RevTek. In addition to connecting with
                    Students, you will be able to view Contracts posted by
                    Companies. Here, you will be able to bid on and complete
                    Contracts that test your skills and grow your resume.
                  </div>
                </div>
                <Typography
                  variant="h6"
                  color="black"
                  style={{ fontSize: "17px" }}
                />
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => this.signUpStudClicked()}
                  >
                    Sign Up as Student
                  </Button>
                </div>
                <br />
              </Card>
            </Container>
            <Container maxWidth="md">
              <Card
                className="RevTekHome-CompanyCard"
                style={{
                  maxHeight: 600,
                  // maxWidth: 100,
                  overflow: "auto",
                  paddingLeft: "30px",
                  paddingRight: "30px",
                  opacity: 0.95,
                  color: "#282828"
                }}
              >
                <div className="RevTekHome-Title">
                  <b>For Companies</b>
                </div>
                <Divider />
                <br />
                <div>
                  <div
                    className="RevTekHome-CardText"
                    style={{ fontSize: "18px", color: "#282828" }}
                  >
                    Registering as a Company will give your business access to
                    our pool of highly motivated and skilled students. The
                    RevTek Student pool is highly collaborative allowing it to
                    exist as an evergrowing network. The RevTek quick connection
                    technology allows for Contracts to find suitable students in
                    real time, allowing for efficient completion of your
                    companies needs.
                  </div>
                </div>
                <Typography
                  variant="h6"
                  color="black"
                  style={{ fontSize: "17px" }}
                />
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => this.signUpCompClicked()}
                  >
                    Sign Up as Company
                  </Button>
                </div>
                <br />
              </Card>
            </Container>
          </div>
          {/* </div> */}
        </div>
      </div>
    );
  }
}

export default RevTekHome;
