import {
  defaultFont,
  primaryColor,
  dangerColor,
  grayColor
} from "assets/jss/material-dashboard-react.jsx";
import tooltipStyle from "assets/jss/material-dashboard-react/tooltipStyle.jsx";
import checkboxAdnRadioStyle from "assets/jss/material-dashboard-react/checkboxAdnRadioStyle.jsx";
const tasksStyle = {
  ...tooltipStyle,
  ...checkboxAdnRadioStyle,
  table: {
    marginBottom: "0",
    overflow: "visible"
  },
  tableRow: {
    position: "relative",
    borderBottom: "1px solid " + grayColor[5]
  },
  tableActions: {
    display: "flex",
    border: "none",
    padding: "12px 8px !important",
    verticalAlign: "middle"
  },
  tableCell: {
    ...defaultFont,
    padding: "8px",
    verticalAlign: "middle",
    border: "none",
    lineHeight: "1.42857143",
    fontSize: "14px"
  },
  tableCellRTL: {
    textAlign: "right"
  },
  tableActionButton: {
    width: "18px",
    height: "18px",
    padding: "0"
  },
  tableActionButtonIcon: {
    width: "10px",
    height: "10px"
  },
  edit: {
    backgroundColor: "transparent",
    color: primaryColor[0],
    boxShadow: "none"
  },
  close: {
    backgroundColor: "transparent",
    color: dangerColor[0],
    boxShadow: "none"
  }
};
export default tasksStyle;
