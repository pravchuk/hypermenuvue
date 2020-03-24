import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
// core components
import tasksStyle from "assets/jss/material-dashboard-react/components/tasksStyle.jsx";
import { connect } from "react-redux";
import FoodItem from "components/FoodItem/FoodItem.jsx";
import TableList from "views/TableList/TableList.jsx";
import green from "@material-ui/core/colors/green";
import store, { getFoodMenuThunk, updateFoodMenuThunk } from "store";
import Button from "@material-ui/core/Button";

const IS_NON_VEG = 1; // 0001
const IS_DISABLED = 2; // 0010
const IS_RECOMMENDED = 4; // 0100
const IS_TODAYS_SPECIAL = 8; // 1000

const styles = {
  table: {
    display: "block"
  }
};

const MenuTheme = createMuiTheme({
  palette: {
    primary: green
  }
});

export const isNonVeg = flag => {
  return flag & IS_NON_VEG ? true : false;
};
export const isDisabled = flag => {
  return flag & IS_DISABLED ? true : false;
};
export const isRecommended = flag => {
  return flag & IS_RECOMMENDED ? true : false;
};
export const isTodaysSpecial = flag => {
  return flag & IS_TODAYS_SPECIAL ? true : false;
};

let restId = "";

class MenuFoodItems extends React.Component {
  constructor(props) {
    super(props);
  }
  // state = {
  //   checked: this.props.checkedIndexes
  // };

  // handleToggle = value => () => {
  //   const { checked } = this.state;
  //   const currentIndex = checked.indexOf(value);
  //   const newChecked = [...checked];

  //   if (currentIndex === -1) {
  //     newChecked.push(value);
  //   } else {
  //     newChecked.splice(currentIndex, 1);
  //   }

  //   this.setState({
  //     checked: newChecked
  //   });
  //   this.x = 0;
  // };

  vegStateChange(flag, ste) {
    return ste ? flag | IS_NON_VEG : flag & ~IS_NON_VEG;
  }
  disabledStateChange(flag, ste) {
    return ste ? flag & ~IS_DISABLED : flag | IS_DISABLED;
  }
  recommendedStateChange(flag, ste) {
    return ste ? flag | IS_RECOMMENDED : flag & ~IS_RECOMMENDED;
  }
  todaySpecialStateChange(flag, ste) {
    return ste ? flag | IS_TODAYS_SPECIAL : flag & ~IS_TODAYS_SPECIAL;
  }

  disableClicked(inst, foodId, disabled) {
    const obj = inst.props.myState.foodMenu.get(foodId);
    obj.Flag = inst.disabledStateChange(obj.Flag, disabled);
    inst.setItemDispatch(foodId, obj);
  }

  recommendClicked(inst, foodId, val) {
    const obj = inst.props.myState.foodMenu.get(foodId);
    obj.Flag = inst.recommendedStateChange(obj.Flag, val);
    inst.setItemDispatch(foodId, obj);
  }

  todaysSpecialClicked(inst, foodId, val) {
    const obj = inst.props.myState.foodMenu.get(foodId);
    obj.Flag = inst.todaySpecialStateChange(obj.Flag, val);
    inst.setItemDispatch(foodId, obj);
  }

  priceChanged(inst, foodId, val) {
    val = parseInt(val, 10);
    if (typeof val != "number" && val > 0) return;
    const obj = inst.props.myState.foodMenu.get(foodId);
    obj.Price = val;
    inst.setItemDispatch(foodId, obj);
  }

  setItemDispatch(foodId, obj) {
    store.dispatch({
      type: "SET_ITEM",
      payload: {
        foodId: foodId,
        foodObj: obj
      }
    });
  }

  saveMenu(restaurantId, myState) {
    console.log(myState.updatedIds);
    console.log(myState.foodMenu);
    store.dispatch(
      updateFoodMenuThunk(restaurantId, myState.updatedIds, myState.foodMenu)
    );
    myState.updatedIds = new Set();
  }

  createTable = () => {
    let table = [];

    const { classes, filterType, myState } = this.props;
    const inst = this;
    myState.foodMenu.forEach(function(foodObj, foodId) {
      if (
        foodObj.Flag !== undefined &&
        (filterType == 0 ||
          (filterType == 1 && isRecommended(foodObj.Flag)) ||
          (filterType == 2 && isTodaysSpecial(foodObj.Flag)) ||
          (filterType == 3 && isDisabled(foodObj.Flag)))
      ) {
        table.push(
          <FoodItem
            key={foodId}
            inst={inst}
            classes={classes}
            foodId={foodId}
            foodObj={foodObj}
            filterType={filterType}
          />
        );
      }
    });
    return table;
  };

  render() {
    const { classes, tasksIndexes, myState, tableInst } = this.props;
    const foodMenu = myState.foodMenu;
    if (tableInst.state.saveClicked) {
      this.saveMenu(restId, myState);
      tableInst.handleSavingDone();
    }
    return (
      <div>
        {myState.updatedIds.size > 0 ? (
          <div style={{ display: "flex", margin: "10px auto" }}>
            <MuiThemeProvider theme={MenuTheme}>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  console.log("save clicked");
                  tableInst.handleClickOpen(myState);
                }}
                style={{ margin: "auto", color: green[0] }}
              >
                Save Changes
              </Button>
            </MuiThemeProvider>
          </div>
        ) : (
          ""
        )}
        <Table style={styles.table} className={classes.table}>
          <TableBody>
            {(foodMenu.length !== undefined && foodMenu.length <= 0) ||
            (foodMenu.size !== undefined && foodMenu.size <= 0)
              ? "Downloading..."
              : this.createTable()}
            {/* <TableCell className={classes.tableActions}>
              <Tooltip
                id="tooltip-top"
                title="Edit Task"
                placement="top"
                classes={{ tooltip: classes.tooltip }}
              >
                <NavLink
                  to={pathToEditFoodItem + "?foodid=" + foodId}
                  activeClassName="active"
                  key={foodId}
                >
                  <IconButton
                    aria-label="Edit"
                    className={classes.tableActionButton}
                  >
                    <Edit
                      className={
                        classes.tableActionButtonIcon + " " + classes.edit
                      }
                    />
                  </IconButton>
                </NavLink>
              </Tooltip>
            </TableCell>*/}
          </TableBody>
        </Table>
      </div>
    );
  }
}

MenuFoodItems.propTypes = {
  classes: PropTypes.object.isRequired,
  tasksIndexes: PropTypes.arrayOf(PropTypes.number),
  myState: PropTypes.object,
  filterType: PropTypes.number,
  tableInst: PropTypes.instanceOf(TableList),
  restaurantId: PropTypes.string
};

function mapState(state, ownProps) {
  restId = ownProps.restaurantId;
  return {
    myState: state
  };
}

const mapDispatch = dispatch => {
  dispatch(getFoodMenuThunk(restId));
  return {};
};

export default connect(
  mapState,
  mapDispatch
)(withStyles(tasksStyle)(MenuFoodItems));
