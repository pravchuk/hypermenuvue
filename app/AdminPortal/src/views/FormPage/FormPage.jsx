import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import Divider from "@material-ui/core/Divider";
import green from "@material-ui/core/colors/green";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import qs from "query-string";
import { foodMenuMap } from "store";

const styles = {
  toggleDiv: {
    maxWidth: 300,
    marginTop: 40,
    marginBottom: 5
  },
  toggleLabel: {
    //color: grey400//,
    fontWeight: 200
  },
  buttons: {
    marginTop: 30,
    float: "right"
  },
  saveButton: {
    marginLeft: 5
  },
  category: {
    minWidth: 200
  }
};

class FormPage extends React.Component {
  constructor(props) {
    super(props);
    this.foodid = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    }).foodid;
    this.goBack = this.goBack.bind(this);
    this.state = {
      isNonVeg: foodMenuMap.get(this.foodid).IsNonVeg
    };
  }

  goBack() {
    this.props.history.goBack();
  }

  printsomething() {
    console.log(foodMenuMap["11"]);
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardBody>
              <form>
                <TextField
                  placeholder="Food name"
                  label="Food"
                  defaultValue={
                    foodMenuMap !== undefined &&
                    foodMenuMap.get(this.foodid) !== undefined
                      ? foodMenuMap.get(this.foodid).Name
                      : ""
                  }
                  fullWidth={true}
                />
                <TextField
                  placeholder="Price in Rupees"
                  label="Price"
                  defaultValue={
                    foodMenuMap !== undefined &&
                    foodMenuMap.get(this.foodid) !== undefined
                      ? foodMenuMap.get(this.foodid).Price
                      : ""
                  }
                  fullWidth={true}
                />
                {/* <FormControl>
                  <InputLabel htmlFor="food-item-category">Category</InputLabel>
                  <NativeSelect
                    label="Category"
                    value=""
                    input={<Input name="category" id="food-item-category" />}
                    style={styles.category}
                  >
                    <MenuItem key={0} primaryText="Starters" />
                    <MenuItem key={1} primaryText="Main Course" />
                    <MenuItem key={2} primaryText="Desserts" />
                  </NativeSelect>
                </FormControl> */}

                {/* <DatePicker
            hintText="Expiration Date"
            floatingLabelText="Expiration Date"
            fullWidth={true}/> */}

                <div style={styles.toggleDiv}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={this.state.isNonVeg}
                        onChange={this.handleChange("isNonVeg")}
                        color={green[400]}
                      />
                    }
                    label="Is it Non Veg?"
                    style={styles.toggleLabel}
                  />
                </div>

                <Divider />

                <div style={styles.buttons}>
                  <Link to="/">
                    <Button variant="contained" onClick={this.goBack}>
                      Cancel
                    </Button>
                  </Link>

                  <Button
                    variant="contained"
                    style={styles.saveButton}
                    type="submit"
                    color="primary"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

// const mapState = state => ({
//   menumap: state
// });

// const mapDispatch = dispatch => {
//   //dispatch(getFoodMenuThunk("0"));
//   return {};
// };

export default FormPage;

// export default FormPage;
