import React from "react";
import { Redirect } from "react-router";
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
// @material-ui/icons
import ViewList from "@material-ui/icons/ViewList";
// core components
import Button from "components/CustomButtons/Button.jsx";
import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle";
import * as firebase from "firebase";

let inst = {};

class HeaderLinks extends React.Component {
  constructor(props) {
    super(props);
    inst = this;
  }
  state = {
    open: false,
    logout: false
  };
  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  };

  handleSignOut(event) {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
        inst.setState({
          logout: true
        });
      })
      .catch(function(error) {
        // An error happened.
        console.log("error happened when logging out");
        console.log(error);
      });
    inst.handleClose(event);
  }

  render() {
    const { classes } = this.props;
    const { open } = this.state;
    if (this.state.logout) {
      return <Redirect to="/admin/login" />;
    }
    return (
      <div>
        {/* <div className={classes.searchWrapper}>
          <CustomInput
            formControlProps={{
              className: classes.margin + " " + classes.search
            }}
            inputProps={{
              placeholder: "Search",
              inputProps: {
                "aria-label": "Search"
              }
            }}
          />
          <Button color="white" aria-label="edit" justIcon round>
            <Search />
          </Button>
        </div> */}
        {/* <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-label="Dashboard"
          className={classes.buttonLink}
        >
          <Dashboard className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Dashboard</p>
          </Hidden>
        </Button> */}
        <div className={classes.manager}>
          <Button
            buttonRef={node => {
              this.anchorEl = node;
            }}
            color={window.innerWidth > 959 ? "transparent" : "white"}
            justIcon={window.innerWidth > 959}
            simple={!(window.innerWidth > 959)}
            aria-owns={open ? "menu-list-grow" : null}
            aria-haspopup="true"
            onClick={this.handleToggle}
            className={classes.buttonLink}
          >
            <ViewList className={classes.icons} />
            {/* <span className={classes.notifications}>5</span> */}
            <Hidden mdUp implementation="css">
              <p onClick={this.handleClick} className={classes.linkText}>
                Help
              </p>
            </Hidden>
          </Button>
          <Poppers
            open={open}
            anchorEl={this.anchorEl}
            transition
            disablePortal
            className={
              classNames({ [classes.popperClose]: !open }) +
              " " +
              classes.pooperNav
            }
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList role="menu">
                      <a href="tel:+91-9912581389">
                        <MenuItem
                          onClick={this.handleClose}
                          className={classes.dropdownItem}
                        >
                          Call Support
                        </MenuItem>
                      </a>
                      <MenuItem
                        onClick={this.handleSignOut}
                        className={classes.dropdownItem}
                      >
                        Log Out
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Poppers>
        </div>
        {/* <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-label="Person"
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button> */}
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
