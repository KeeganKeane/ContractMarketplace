import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { fade } from "@material-ui/core/styles/colorManipulator";
import Home from "@material-ui/icons/Home";
import ExitToApp from "@material-ui/icons/ExitToApp";
import AssignmentTurnedIn from "@material-ui/icons/AssignmentTurnedIn";
import MoreIcon from "@material-ui/icons/MoreVert";
import Button from "@material-ui/core/Button";
import Logo from "./revteklogo.png";

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  company: {
    marginRight: theme.spacing(5)
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 200
    }
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  fab: {
    margin: theme.spacing(2)
  },
  absolute: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(3)
  }
}));

function RevTekHomeNavBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  function handleProfileMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    handleMobileMenuClose();
  }

  function handleMobileMenuOpen(event) {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    />
  );

  const homeClicked = e => {
    // Redirects to admin home page
    props.history.push("/");
  };

  const signUpClicked = e => {
    // Redirects to signin page
    props.history.push("/signup");
  };

  const signInClicked = e => {
    // Redirects to signin page
    props.history.push("/signin");
  };

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton color="#202020" onClick={() => homeClicked()}>
          <Home />
        </IconButton>
      </MenuItem>
      <MenuItem>
        <IconButton color="#202020" onClick={() => signUpClicked()}>
          <AssignmentTurnedIn />
        </IconButton>
      </MenuItem>
      <MenuItem>
        <IconButton color="#202020" onClick={() => signInClicked()}>
          <ExitToApp />
        </IconButton>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar
        position="static"
        style={{
          height: "60px",
          boxShadow: "none"
        }}
      >
        <Toolbar style={{ marginTop: "-2px" }}>
          <Button
            variant="text"
            href="/"
          >
            <img className="navBarLogo" src={Logo} />
          </Button>

          <Typography
            className={classes.title}
            variant="h6"
            noWrap
            align="center"
            style={{ fontSize: "20px" }}
          >
            {props.title}
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Tooltip title="Home">
              <IconButton color="inherit" onClick={() => homeClicked()}>
                <Home />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sign Up">
              <IconButton color="inherit" onClick={() => signUpClicked()}>
                <AssignmentTurnedIn />
              </IconButton>
            </Tooltip>
            <Tooltip title="Login">
              <IconButton color="inherit" onClick={() => signInClicked()}>
                <ExitToApp />
              </IconButton>
            </Tooltip>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
      {renderMobileMenu}
    </div>
  );
}

export default RevTekHomeNavBar;
