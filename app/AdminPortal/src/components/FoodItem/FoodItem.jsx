import React from "react";
import PropTypes from "prop-types";
//import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
// @material-ui/icons
import DropDown from "@material-ui/icons/ArrowDropDownCircle";
import DropUp from "@material-ui/icons/ArrowDropUp";
// core components
import TextField from "@material-ui/core/TextField";
import MenuFoodItems from "components/MenuFoodItems/MenuFoodItems.jsx";
import grey from "@material-ui/core/colors/grey";
import green from "@material-ui/core/colors/green";
import blue from "@material-ui/core/colors/blue";
import deepOrange from "@material-ui/core/colors/deepOrange";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteIconOutlined from "@material-ui/icons/FavoriteBorderOutlined";
import Star from "@material-ui/icons/Star";
import StarOutlined from "@material-ui/icons/StarBorderOutlined";
import Visbility from "@material-ui/icons/Visibility";
import VisibilityOffOutlined from "@material-ui/icons/VisibilityOffOutlined";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import {
  isDisabled,
  isRecommended,
  isTodaysSpecial
} from "components/MenuFoodItems/MenuFoodItems.jsx";

class FoodItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      optionsOpened: false,
      disabled: false,
      recommended: false,
      todaysSpecial: false
    };
    this.currentFilterType = 0;
  }

  toggleOptionsView(instFi) {
    const b = instFi.state.optionsOpened;
    instFi.setState({
      optionsOpened: !b
    });
  }

  //Highlighting row
  //Grey[500] - Disabled
  //Grey[50] - Not Disabled (normal) (white)
  //DeepOrange[500] - Recommended
  //green[500] - Today's Special
  //Amber[500] - Recommended and Today's Special
  checkHighLightColor(flagObj) {
    const val = flagObj.disabled ? grey[500] : grey[0];
    return val;
    // : flagObj.recommended && flagObj.todaysSpecial
    //   ? amber[500]
    //   : flagObj.recommended
    //     ? deepOrange[500]
    //     : flagObj.todaysSpecial
    //       ? green[500]
  }

  componentDidMount() {
    const { foodObj, inst } = this.props;
    this.setState({
      optionsOpened: false,
      disabled: isDisabled(foodObj.Flag),
      recommended: isRecommended(foodObj.Flag),
      todaysSpecial: isTodaysSpecial(foodObj.Flag)
    });
  }

  render() {
    const { classes, foodId, foodObj, inst, filterType } = this.props;
    const instFi = this;
    if (filterType != this.currentFilterType) {
      this.currentFilterType = filterType;
      this.componentDidMount();
    }
    const flagObj = {
      disabled: isDisabled(foodObj.Flag),
      recommended: isRecommended(foodObj.Flag),
      todaysSpecial: isTodaysSpecial(foodObj.Flag)
    };

    return (
      <div>
        <TableRow
          style={{ backgroundColor: this.checkHighLightColor(flagObj) }}
          className={classes.tableRow}
        >
          {/* <TableCell className={classes.tableCell}>
              <Checkbox
                checked={checked.indexOf(foodId) !== -1}
                tabIndex={-1}
                onClick={handleToggle(foodId)}
                checkedIcon={<Check className={classes.checkedIcon} />}
                icon={<Check className={classes.uncheckedIcon} />}
                classes={{
                  checked: classes.checked
                }}
              />
            </TableCell> */}
          {/* <TableCell className={classes.tableCell}>
                      {doc.Name}
                    </TableCell> */}
          {/*console.log(foodId)*/}
          <TableCell
            onClick={() => {
              this.toggleOptionsView(instFi);
            }}
            className={classes.tableCell}
            style={{ width: 400 }}
          >
            {foodObj.Name}
          </TableCell>
          <TableCell className={classes.tableCell}>
            <TextField
              placeholder="Price"
              label="Price"
              defaultValue={foodObj.Price}
              fullWidth={true}
              style={{ width: 50 }}
              onChange={event => {
                inst.priceChanged(inst, foodId, event.target.value);
              }}
            />
          </TableCell>
          <TableCell
            onClick={() => {
              this.toggleOptionsView(instFi);
            }}
            className={classes.tableActions}
          >
            {/* <Tooltip
              id="tooltip-top-start"
              title="Remove"
              placement="top"
              classes={{ tooltip: classes.tooltip }}
            > */}
            <IconButton
              aria-label="Available"
              className={classes.tableActionButton}
            >
              {!this.state.optionsOpened ? (
                <DropDown
                  className={
                    classes.tableActionButtonIcon + " " + classes.dropdown
                  }
                />
              ) : (
                <DropUp
                  className={
                    classes.tableActionButtonIcon + " " + classes.dropup
                  }
                />
              )}
            </IconButton>
            {/* </Tooltip> */}
          </TableCell>
        </TableRow>
        {/* {false ? ( */}
        {this.state.optionsOpened ? (
          <Paper square className={classes.root}>
            {/* <Tabs fullWidth indicatorColor="primary" textColor="primary"> */}
            <GridContainer>
              <GridItem xs={4} sm={4} md={4}>
                <Tab
                  style={
                    this.state.recommended
                      ? { color: deepOrange[500] }
                      : { color: grey[500] }
                  }
                  icon={
                    this.state.recommended ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteIconOutlined />
                    )
                  }
                  onClick={() => {
                    inst.recommendClicked(
                      inst,
                      foodId,
                      !instFi.state.recommended
                    );
                    instFi.setState({
                      recommended: !instFi.state.recommended
                    });
                  }}
                />
              </GridItem>
              <GridItem xs={4} sm={4} md={4}>
                <Tab
                  style={
                    this.state.todaysSpecial
                      ? { color: green[500] }
                      : { color: grey[500] }
                  }
                  icon={this.state.todaysSpecial ? <Star /> : <StarOutlined />}
                  onClick={() => {
                    inst.todaysSpecialClicked(
                      inst,
                      foodId,
                      !instFi.state.todaysSpecial
                    );
                    instFi.setState({
                      todaysSpecial: !instFi.state.todaysSpecial
                    });
                  }}
                />
              </GridItem>
              <GridItem xs={4} sm={4} md={4}>
                <Tab
                  style={
                    this.state.disabled
                      ? { color: grey[500] }
                      : { color: blue[500] }
                  }
                  icon={
                    this.state.disabled ? (
                      <VisibilityOffOutlined />
                    ) : (
                      <Visbility />
                    )
                  }
                  onClick={() => {
                    inst.disableClicked(inst, foodId, instFi.state.disabled);
                    instFi.setState({
                      disabled: !instFi.state.disabled
                    });
                  }}
                />
              </GridItem>
            </GridContainer>
          </Paper>
        ) : (
          ""
        )}
      </div>
    );
  }
}

FoodItem.propTypes = {
  classes: PropTypes.object.isRequired,
  foodId: PropTypes.string,
  foodObj: PropTypes.object,
  inst: PropTypes.instanceOf(MenuFoodItems),
  filterType: PropTypes.number
};

export default FoodItem;
