import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import grey from "@material-ui/core/colors/grey";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as firebase from "firebase";
import Dialog from "@material-ui/core/Dialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogTitle from "@material-ui/core/DialogTitle";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import InputAdornment from "@material-ui/core/InputAdornment";

const styles = {
  loginContainer: {
    minWidth: 320,
    maxWidth: 400,
    height: "auto",
    position: "absolute",
    top: "20%",
    left: 0,
    right: 0,
    margin: "auto"
  },
  paper: {
    padding: 20,
    overflow: "auto"
  },
  buttonsDiv: {
    textAlign: "center",
    padding: 10
  },
  flatButton: {
    color: grey[500]
  },
  checkRemember: {
    style: {
      float: "left",
      maxWidth: 180,
      paddingTop: 5
    },
    labelStyle: {
      color: grey[500]
    },
    iconStyle: {
      color: grey[500],
      borderColor: grey[500],
      fill: grey[500]
    }
  },
  loginBtn: {
    float: "right",
    marginTop: 10
  },
  btn: {
    background: "#4f81e9",
    color: grey[0],
    padding: 7,
    borderRadius: 2,
    margin: 2,
    fontSize: 13
  },
  btnFacebook: {
    background: "#4f81e9"
  },
  btnGoogle: {
    background: "#e14441"
  },
  btnSpan: {
    marginLeft: 5
  }
};

const CHECK = "CHECK";
const NOT_LOGGED_IN = "NOTLOGGEDIN";
const SMS_SENT = "SMS_SENT";
const LOGGED_IN = "LOGGEDIN";

let inst = {};

class Login extends React.Component {
  constructor(props) {
    super(props);
    //this.classes = props;
    this.state = {
      inputText: "",
      stage: CHECK,
      processing: false
    };
    this.updateInputValue = this.updateInputValue.bind(this);
    this.onSignInSubmit = this.onSignInSubmit.bind(this);
    this.dialogTitle = "Loading...";
    inst = this;
  }

  componentDidMount() {
    if (this.state.stage === CHECK) {
      //check if already logged in
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          console.log("already logged in");
          inst.setState({ stage: LOGGED_IN });
        } else {
          // No user is signed in.
          console.log("not logged in");
          inst.setState({ stage: NOT_LOGGED_IN }, () => {
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
              "signInButton",
              {
                size: "invisible",
                callback: function(response) {
                  // reCAPTCHA solved, allow signInWithPhoneNumber.
                  console.log("captcha callback");
                  console.log(response);
                  //inst.onSignInSubmit();
                }
              }
            );
          });
        }
      });
    }
  }

  confirmCode(e) {
    e.preventDefault();
    if (inst.state.inputText.length !== 6) return;
    window.confirmationResult
      .confirm(inst.state.inputText)
      .then(function(result) {
        // User signed in successfully.
        var user = result.user;
        console.log("user");
        console.log(user);
        // ...
      })
      .catch(function(error) {
        // User couldn't sign in (bad verification code?)
        // ...
        console.log(error);
      });
  }

  onSignInSubmit(e) {
    e.preventDefault();
    if (inst.state.inputText.length !== 10) return;
    this.dialogTitle = "Sending SMS OTP";
    this.setState({ processing: true });
    firebase
      .auth()
      .signInWithPhoneNumber(
        "+91" + this.state.inputText,
        window.recaptchaVerifier
      )
      .then(function(confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        inst.dialogTitle = "Loading";
        inst.setState({ inputText: "", stage: SMS_SENT, processing: false });
      })
      .catch(function(error) {
        // Error; SMS not sent
        // ...
        console.log(error);
      });
  }

  updateInputValue(event) {
    //check length limits
    if (this.state.stage === NOT_LOGGED_IN && event.target.value.length > 10)
      return;
    if (this.state.stage === SMS_SENT && event.target.value.length > 6) return;
    this.setState({
      inputText: event.target.value
    });
  }

  render() {
    const classes = this.props.classes;
    if (this.state.stage === LOGGED_IN) {
      return <Redirect to="/admin/home" />;
    }
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Restaurant Owner Login</h4>
              <p className={classes.cardCategoryWhite}>
                Please enter your registered phone number
              </p>
            </CardHeader>
            <CardBody>
              {this.state.stage === NOT_LOGGED_IN ? (
                <TextField
                  placeholder="Enter Phone Number"
                  label="Phone Number"
                  fullWidth={true}
                  maxLength={10}
                  type="number"
                  value={this.state.inputText}
                  onChange={this.updateInputValue}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+91</InputAdornment>
                    )
                  }}
                />
              ) : this.state.stage === SMS_SENT ? (
                <TextField
                  placeholder="Enter OTP"
                  label="SMS OTP"
                  fullWidth={true}
                  maxLength={6}
                  type="number"
                  value={this.state.inputText}
                  onChange={this.updateInputValue}
                />
              ) : (
                ""
              )}
              <div id="recaptcha-container" />
              <div>
                {/* USE IF ACTION CARD IS USED */}
                {/*<Checkbox
                  label="Remember me"
                  //style={styles.checkRemember.style}
                  // labelStyle={styles.checkRemember.labelStyle}
                  // iconStyle={styles.checkRemember.iconStyle}
                  classes={{
                    label: styles.checkRemember.labelStyle,
                    root: styles.checkRemember.style
                  }}
                >
                  Remember me
                </Checkbox> */}

                {this.state.stage === SMS_SENT ? (
                  <Button
                    label="VerifyOtp"
                    color="secondary"
                    variant="contained"
                    style={styles.loginBtn}
                    id="verifyOtp"
                    onClick={this.confirmCode}
                    type="submit"
                  >
                    Verify OTP
                  </Button>
                ) : (
                  <Button
                    label="Login"
                    color="primary"
                    variant="contained"
                    style={styles.loginBtn}
                    id="signInButton"
                    onClick={this.onSignInSubmit}
                    type="submit"
                  >
                    Login
                  </Button>
                )}
              </div>
              <div id="recaptcha-container" />
              <Dialog
                aria-labelledby="simple-dialog-title"
                open={this.state.processing || this.state.stage === CHECK}
              >
                <DialogTitle id="simple-dialog-title">
                  {this.dialogTitle}
                </DialogTitle>
                <CircularProgress
                  className={this.props.classes.progress}
                  style={{ padding: 20, margin: "auto" }}
                />
              </Dialog>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(Login);
