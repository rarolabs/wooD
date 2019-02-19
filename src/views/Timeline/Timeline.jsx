import React, { PureComponent } from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import StarIcon from "@material-ui/icons/Star";
import LocalShipping from "@material-ui/icons/LocalShipping";
import Search from "@material-ui/icons/Search";
import AddAlert from "@material-ui/icons/AddAlert";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import {
  VerticalTimeline,
  VerticalTimelineElement
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import Moment from "moment";
import { withRouter } from "react-router";
Moment.locale("pt-BR");


const woodLotJSON = require("build-contracts/WoodManager.json");
const MyContract = window.web3.eth.contract(woodLotJSON.abi);
const myContractInstance = MyContract.at(
  Object.keys(woodLotJSON.networks).map(
    key => woodLotJSON.networks[key].address
  )[0]
);

const status = {0: "Retirada no Fornecedor", 1: "Em Trânsito", 2: "Entregue"}

const getLotShipment = (lotId, shipId) =>
  new Promise((resolve, reject) => {
    myContractInstance.getLotShipment.call(lotId, shipId, (err, res) => {
      if (!err) {
        resolve({
          descricao: res[0],
          timestamp: res[1].toNumber(),
          data: Moment(res[1].toNumber() * 1000).format("DD/MM/YYYY hh:mm:ss"),
          destino: res[2],
          statusCode: res[3].toNumber(),
          statusName: status[res[3].toNumber()]
        });
      } else {
        reject(err);
      }
    });
  });

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
  }
};

class Timeline extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      alerta: false,
      mostrarTimeline: false
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
      mostrarTimeline: false
    });
  };

  componentDidMount() {
    const {
      location: { state }
    } = this.props;

    if (window.web3 && window.web3.isConnected() && state) {
      myContractInstance.getWoodLot.call(state.id,async (err, res) => {
        if (!err) {
          let ships = [];
          for (let i = 0; i < res[4].toNumber(); i++) {
            ships.push(getLotShipment(state.id, i));
          }
          try {
            const timeline = await Promise.all(ships);
            this.setState({ timeline: timeline.sort((a, b) =>
              a.timestamp < b.timestamp
            ).reverse(), mostrarTimeline: true });
          } catch (error) {
            console.log(error);
          }
        }
      });
    }
  }

  handleSearch = () => {
    const { search } = this.state;

    if (window.web3 && window.web3.isConnected() && search) {
      myContractInstance.getWoodLot.call(parseInt(search),async (err, res) => {
        if (!err) {
          let ships = [];
          for (let i = 0; i < res[4].toNumber(); i++) {
            ships.push(getLotShipment(parseInt(search), i));
          }
          try {
            const timeline = await Promise.all(ships);
            this.setState({ timeline: timeline.sort((a, b) =>
              a.timestamp < b.timestamp
            ).reverse(), mostrarTimeline: true });
          } catch (error) {
            console.log(error);
          }
        }
      });
    }

  };

  render() {
    const { search, timeline, mostrarTimeline } = this.state;
    console.log(timeline);

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={9} lg={11}>
                  <CustomInput
                    labelText="Pesquise um pedido"
                    id="search"
                    value={search}
                    onChange={this.handleChange}
                    formControlProps={{
                      fullWidth: true
                    }}
                    style={{ margin: 0 }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3} lg={1}>
                  <Button
                    onClick={this.handleSearch}
                    color="white"
                    aria-label="edit"
                    justIcon
                    round
                  >
                    <Search />
                  </Button>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card plain>
            <CardBody>
              {mostrarTimeline ? (
                <VerticalTimeline>
                  {timeline.map(timeline => {
                    return (
                      <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        date={Moment(timeline.timestamp*1000).format(
                          "D MMM YYYY - hh:mm:ss"
                        )}
                        iconStyle={
                          timeline.statusCode === 0
                            ? { background: "rgb(16, 204, 82)", color: "#fff" }
                            : { background: "rgb(33, 150, 243)", color: "#fff" }
                        }
                        icon={
                          timeline.statusCode === 0 ? (
                            <StarIcon />
                          ) : (
                            <LocalShipping />
                          )
                        }
                      >
                        <h3 className="vertical-timeline-element-title">
                          {timeline.statusName}
                        </h3>
                        <p>{timeline.descricao} </p>
                      </VerticalTimelineElement>
                    );
                  })}
                </VerticalTimeline>
              ) : null}
            </CardBody>
          </Card>
        </GridItem>
        <Snackbar
          place="tc"
          color="warning"
          icon={AddAlert}
          message="Pedido não encontrado"
          open={this.state.alerta}
          closeNotification={() => this.setState({ alerta: false })}
          close
        />
      </GridContainer>
    );
  }
}

export default withRouter(withStyles(styles)(Timeline));
