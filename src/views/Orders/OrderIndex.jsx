import React, { PureComponent, Fragment } from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icons
import LocalShipping from "@material-ui/icons/LocalShipping";
import TimelineIcon from "@material-ui/icons/Timeline";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import { Link } from "react-router-dom";

const woodLotJSON = require("build-contracts/WoodManager.json");

const MyContract = window.web3.eth.contract(woodLotJSON.abi);
const myContractInstance = MyContract.at(
  Object.keys(woodLotJSON.networks).map(
    key => woodLotJSON.networks[key].address
  )[0]
);

const status = { 1: "Em Trânsito", 2: "Entregue" };

const getProduto = i =>
  new Promise((resolve, reject) => {
    myContractInstance.getWoodLot.call(i, (err, res) => {
      if (!err) {
        console.log("res", res);
        resolve({
          id: i,
          nomeFazenda: res[2],
          madeira: res[0],
          quantidade: res[1],
          statusCode: res[5].toNumber(),
          statusName: status[res[5].toNumber()],
          totalShipment: res[4].toNumber()
        });
      } else {
        reject(err);
      }
    });
  });

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  tableActionButton: {
    width: "27px",
    height: "27px",
    padding: "0"
  },
  tableActionButtonIcon: {
    width: "17px",
    height: "17px"
  }
};

class OrderIndex extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      produtos: []
    };
  }


  componentWillMount() {
    if(window.web3 && window.web3.isConnected()) {      
      
      myContractInstance.getNumberOfLots.call(async (err, res) => {
        if(!err) {
          let prods = []
          for(let i = 0; i < res.toNumber(); i++) {            
            prods.push(getProduto(i));            
          }
          try {
            const produtos = await Promise.all(prods);      
            this.setState({ produtos: produtos.filter( prd => parseInt(prd.statusCode) > 0 ) })
          } catch (error) {
            console.log(error)
          }
        }        
      });

    }
  }

  render() {
    const { classes } = this.props;
    const { produtos } = this.state;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12} style={{ textAlign: "right" }}>
            <Button component={Link} to="order/new" color="info">
              Novo
            </Button>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Pedidos</h4>
                <p className={classes.cardCategoryWhite}>
                  Listagem de todos os pedidos
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={[
                    "#",
                    "Empresa",
                    "Madeira",
                    "Quantidade",
                    "Status Entrega",
                    "Ações"
                  ]}
                  tableData={produtos.map((ped, currentIndex) => {
                    const {
                      id,
                      timeline,
                      statusCode,
                      totalShipment,
                      ...obj
                    } = ped;
                    return [currentIndex].concat(Object.values(obj)).concat(
                      <Fragment>
                        <Tooltip
                          id="tooltip-top-start"
                          title="Rastreamento"
                          placement="top"
                          classes={{ tooltip: classes.tooltip }}
                        >
                          <IconButton
                            aria-label="LocalShipping"
                            className={classes.tableActionButton}
                            component={Link}
                            to={"shipment/" + id}
                          >
                            <LocalShipping
                              className={`${classes.tableActionButtonIcon} ${
                                classes.close
                              }`}
                              color="red"
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          id="tooltip-top-start"
                          title="Timeline"
                          placement="top"
                          classes={{ tooltip: classes.tooltip }}
                        >
                          <IconButton
                            aria-label="LocalTimeline"
                            className={classes.tableActionButton}
                            component={Link}
                            to={{
                              pathname: "timeline",
                              state: { id }
                            }}
                          >
                            <TimelineIcon
                              className={`${classes.tableActionButtonIcon} ${
                                classes.close
                              }`}
                              color="red"
                            />
                          </IconButton>
                        </Tooltip>
                      </Fragment>
                    );
                  })}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(styles)(OrderIndex);
