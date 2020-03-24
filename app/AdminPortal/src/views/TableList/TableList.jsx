import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import MenuFoodItems from "components/MenuFoodItems/MenuFoodItems.jsx";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AllInclusive from "@material-ui/icons/AllInclusive";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Star from "@material-ui/icons/Star";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import VisibilityOffOutlined from "@material-ui/icons/VisibilityOffOutlined";
import FavoriteIconOutlined from "@material-ui/icons/FavoriteBorderOutlined";
import Visbility from "@material-ui/icons/Visibility";
import StarOutlined from "@material-ui/icons/StarBorderOutlined";
import green from "@material-ui/core/colors/green";
import deepOrange from "@material-ui/core/colors/deepOrange";

import {
  isDisabled,
  isRecommended,
  isTodaysSpecial
} from "components/MenuFoodItems/MenuFoodItems.jsx";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  root: {
    flexGrow: 1,
    maxWidth: 500
  },
  dialogIcons: {
    height: 24,
    verticalAlign: "sub"
  }
};

class TableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuSnapshot: {},
      tabValue: 0,
      dialogOpen: false,
      saveClicked: false,
      dialogScroll: "paper"
    };
    this.li = [];
  }

  handleChange = (event, value) => {
    this.setState({ menuSnapshot: this.state.menuSnapshot, tabValue: value });
  };

  Transition = props => {
    return <Slide direction="up" {...props} />;
  };

  handleClickOpen = myState => {
    this.li = [];
    window.onbeforeunload = function(e) {
      var dialogText = "Please wait. We are saving the edits for your menu.";
      e.returnValue = dialogText;
      return dialogText;
    };
    myState.updatedIds.forEach(foodId => {
      const foodObj = myState.foodMenu.get(foodId);
      this.li.push(
        <li key={"li" + foodId}>
          {foodObj.Name} : Rs.
          {foodObj.Price} <br />
          {isRecommended(foodObj.Flag) ? (
            <FavoriteIcon style={styles.dialogIcons} />
          ) : (
            <FavoriteIconOutlined style={styles.dialogIcons} />
          )}
          {isTodaysSpecial(foodObj.Flag) ? (
            <Star style={styles.dialogIcons} />
          ) : (
            <StarOutlined style={styles.dialogIcons} />
          )}
          {isDisabled(foodObj.Flag) ? (
            <VisibilityOffOutlined style={styles.dialogIcons} />
          ) : (
            <Visbility style={styles.dialogIcons} />
          )}
        </li>
      );
    });
    this.setState({ dialogOpen: true });
  };

  handleClose = () => {
    this.setState({ dialogOpen: false });
  };

  handleSaveClicked = () => {
    this.setState({ saveClicked: true });
  };

  handleSavingDone = () => {
    this.setState({ saveClicked: false, dialogOpen: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Edit Menu</h4>
                <p className={classes.cardCategoryWhite}>
                  Use the items below to edit the menu
                </p>
              </CardHeader>
              <CardBody>
                <Paper square className={classes.root}>
                  <Tabs
                    value={this.state.tabValue}
                    onChange={this.handleChange}
                    fullWidth
                    indicatorColor="secondary"
                    textColor="secondary"
                  >
                    <Tab
                      value={0}
                      icon={<AllInclusive />}
                      label="ALL"
                      style={{ minWidth: 50 }}
                      selected
                    />
                    <Tab
                      value={1}
                      icon={<FavoriteIcon style={{ color: deepOrange[500] }} />}
                      label="FAVOURITE"
                    />
                    <Tab
                      value={2}
                      icon={<Star style={{ color: green[500] }} />}
                      label="TODAY'S SPECIAL"
                    />
                    <Tab
                      value={3}
                      icon={<VisibilityOffOutlined />}
                      style={{ minWidth: 50 }}
                      label="HIDDEN"
                    />
                  </Tabs>
                </Paper>
                <MenuFoodItems
                  checkedIndexes={[0, 3]}
                  tasksIndexes={[0, 1, 2, 3]}
                  filterType={this.state.tabValue}
                  myState={this.state.menuSnapshot}
                  tableInst={this}
                  restaurantId={this.props.restaurantId}
                />
              </CardBody>
            </Card>
          </GridItem>
          {/* ACTION CARD*/}
          {/* <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardBody>
              <FormControl className={classes.formControl}>
                <GridContainer>
                  <GridItem xs={8} sm={8} md={8}>
                    <InputLabel shrink htmlFor="age-native-label-placeholder">
                      Action
                    </InputLabel>
                    <NativeSelect
                      value={"Action"}
                      //onChange={this.handleChange("age")}
                      input={
                        <Input name="age" id="age-native-label-placeholder" />
                      }
                    >
                      <option value="">Do Something</option>
                      <option value={10}>Change Price</option>
                      <option value={20}>Set Unavailable</option>
                      <option value={30}>Set Available</option>
                    </NativeSelect>
                  </GridItem>
                  <GridItem xs={4} sm={4} md={4}>
                    <Button color="primary" variant="contained">
                      Change
                    </Button>
                  </GridItem>
                </GridContainer>
                <FormHelperText>Label + placeholder</FormHelperText>
              </FormControl>
            </CardBody>
          </Card>
        </GridItem> */}
        </GridContainer>
        <div>
          <Dialog
            open={this.state.dialogOpen}
            TransitionComponent={this.Transition}
            keepMounted
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            scroll={this.state.scroll}
          >
            <DialogTitle id="alert-dialog-slide-title">
              {"Sure about your changes?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                <div>
                  Let Flunkey save the changes to the menu. Your changes will
                  live immediately after you press Save.
                </div>
                <ul>{this.li}</ul>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleSaveClicked} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}
TableList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TableList);
