import React from "react";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "../firebase.js";
import Button from "@material-ui/core/Button";
import "./Marketplace.css";
import StudentNavBar from "./Student_NavBar";
import TextField from "@material-ui/core/TextField";
import Search from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";

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

class Marketplace extends React.Component {
  // In marketplace, want to show all contracts with status of available
  // Also want search bar to refine results
  // Each contract needs a "Submit Bid" button, which will take user to new page where they can enter
  //    bid details for that specific contract

  constructor(props) {
    super(props);

    this.state = {
      companyName: "",
      contractName: "",
      contractNames: [],
      contractDetails: [],
      companyNames: [],
      contractKeys: [],
      indices: [],
      searchText: "",
      loaded: false
    };
  }

  componentDidMount = () => {
    // this.retrieveAllContracts();
    this.retrieveAllContracts();
    this.setState({
      loaded: true
    });
  };

  retrieveAllContracts = () => {
    let counter = 0;

    let tempContractNames = [];
    let tempContractDetails = [];
    let tempCompanyNames = [];
    let tempIndices = [];
    let tempKeys = [];
    const contractsRef = firebase.database().ref("contracts");
    contractsRef.on("value", snapshot => {
      // loop through all companies
      snapshot.forEach(function(companies) {
        // loop through each contract
        companies.forEach(function(contracts) {
          // need another loop because of the way firebase is structured
          contracts.forEach(function(individualContract) {
            if (individualContract.val().available) {
              tempIndices.push(counter);
              counter++;
              tempContractNames.push(individualContract.val().contractName);
              tempContractDetails.push(
                individualContract.val().contractDetails
              );
              tempCompanyNames.push(individualContract.val().name);
              tempKeys.push(individualContract.key);
            }
          });
        });
      });

      this.setState({
        contractNames: tempContractNames,
        contractDetails: tempContractDetails,
        companyNames: tempCompanyNames,
        contractKeys: tempKeys,
        indices: tempIndices,
        loaded: true
      });
    });
  };

  submitBidOnContract = (
    contractKey,
    specificCompany,
    specificContract,
    specificDetails
  ) => {
    // from stackoverflow: this.props.router.push
    this.props.history.push({
      pathname: "/submitbid",
      state: {
        key: contractKey,
        company: specificCompany,
        contract: specificContract,
        details: specificDetails
      }
    });
  };

  updateField(field, newValue) {
    this.setState({
      ...this.state,
      [field]: newValue
    });
  }

  render() {
    const classes = useStyles;

    const dataLoaded = this.state.loaded;

    return (
      dataLoaded && (
        <div className="Student-whole">
          <StudentNavBar history={this.props.history} />
          <div className="topstuff">
            {/* <button onClick={() => this.retrieveAllContracts()}>
              Show contracts
            </button> */}
            <h3>Available Contracts</h3>

            <div className="searchbar">
              <TextField
                variant="outlined"
                id="searchbar"
                name="Search for Contracts"
                label="Search for Contracts"
                onChange={e => this.updateField("searchText", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
              />
            </div>

            <p>{this.state.searchText}</p>

            <div className="allBidCards">
              {this.state.indices.length > 0 ? (
                this.state.indices.map(index => {
                  return this.state.searchText === "" ||
                    this.state.companyNames[index].includes(
                      this.state.searchText
                    ) ||
                    this.state.contractNames[index].includes(
                      this.state.searchText
                    ) ||
                    this.state.contractDetails[index].includes(
                      this.state.searchText
                    ) ? (
                    <div className="bidCard" key={index}>
                      <Card raised className={classes.card}>
                        <CardActionArea>
                          <CardContent>
                            <Typography
                              className={classes.title}
                              color="textSecondary"
                              gutterBottom
                            >
                              {this.state.companyNames[index]}
                            </Typography>
                            <Typography variant="h5" component="h2">
                              {this.state.contractNames[index]}
                            </Typography>
                            <Typography variant="body2" component="p">
                              {this.state.contractDetails[index]}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <CardActions>
                          <div className="submitButton">
                            <Button
                              size="small"
                              color="primary"
                              onClick={() =>
                                this.submitBidOnContract(
                                  this.state.contractKeys[index],
                                  this.state.companyNames[index],
                                  this.state.contractNames[index],
                                  this.state.contractDetails[index]
                                )
                              }
                            >
                              Submit Bid
                            </Button>
                          </div>
                        </CardActions>
                      </Card>
                      <br />
                    </div>
                  ) : (
                    <div key={index} />
                  );
                })
              ) : (
                <p />
              )}
            </div>
          </div>
        </div>
      )
    );
  }
}

export default Marketplace;
