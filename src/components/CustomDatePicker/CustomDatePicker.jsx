import React, { PureComponent } from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import FormControl from "@material-ui/core/FormControl";
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';

class CustomDatePicker extends PureComponent {
  state = {
    selectedDate: new Date(),
  };

  handleDateChange = date => {
    this.setState({ selectedDate: date });
  };

  render() {
    const { selectedDate } = this.state;
    const {
      classes,
      formControlProps
    } = this.props;
    return (
      <FormControl
        {...formControlProps}
        className={formControlProps.className + " " + classes.formControl}
      >
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              margin="normal"
              label="Data"
              value={selectedDate}
              format="DD/MM/YYYY"
              placeholder="19/02/2019"
              onChange={this.handleDateChange}
              animateYearScrolling
            />
          </MuiPickersUtilsProvider>

      </FormControl>
    );
  }
}

CustomDatePicker.propTypes = {
  classes: PropTypes.object.isRequired,
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool
};

export default withStyles()(CustomDatePicker);
