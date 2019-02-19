import React, { PureComponent } from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import AddAlert from "@material-ui/icons/AddAlert";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomSelect from "components/CustomSelect/CustomSelect.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";

const woodLotJSON = require('build-contracts/WoodManager.json');
const MyContract = window.web3.eth.contract(woodLotJSON.abi);
const myContractInstance = MyContract.at(
  Object.keys(woodLotJSON.networks).map(
    key => woodLotJSON.networks[key].address
  )[0]
);

const getProduto = i =>
  new Promise((resolve, reject) => {
    myContractInstance.getWoodLot.call(i, (err, res) => {
      if (!err) {
        resolve({ id: i, name: res[0] });
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
  }
};

class OrderNew extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      idLote: "",
      destino: "",
      situacaoEntrega: 0,
      produtos: [],
      alerta: false
    };
  }

  componentWillMount() {
    if (window.web3 && window.web3.isConnected()) {
      myContractInstance.getNumberOfLots.call(async (err, res) => {
        if (!err) {
          let prods = [];
          for (let i = 0; i < res.toNumber(); i++) {
            prods.push(getProduto(i));
          }
          try {
            const produtos = await Promise.all(prods);
            this.setState({ produtos });
          } catch (error) {
            console.log(error);
          }
        }
      });
    }
  };

  handleChange = event => {
    if (event.target && event.target.name === "idLote") {
      this.setState({
        [event.target.name]: event.target.value
      });
    } else {
      this.setState({
        [event.target.id]: event.target.value
      });
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const { idLote, destino, situacaoEntrega } = this.state;
    myContractInstance.registerLotShipment(idLote, destino, "", situacaoEntrega, { from: window.acc }, (err, res) => {
      if(!err) {
        this.setState({ alerta: true }, () => {
          setTimeout(() => {
            this.props.history.goBack();
          }, 1000);
        });
      } else {
        this.props.history.goBack()
      }
    });
  };

  render() {
    const { classes } = this.props;
    const { idLote, destino, produtos } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Pedido </h4>
                <p className={classes.cardCategoryWhite}>
                  Informe os dados do pedido
                </p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomSelect
                      labelText="Lote"
                      id="idLote"
                      value={idLote}
                      onChange={this.handleChange}
                      list={produtos}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Destino"
                      id="destino"
                      value={destino}
                      onChange={this.handleChange}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button onClick={this.handleSubmit} color="primary">
                  Salvar
                </Button>
                <Button onClick={() => this.props.history.goBack()}>
                  Cancelar
                </Button>
              </CardFooter>
            </Card>
          </GridItem>

        </GridContainer>

        <Snackbar
          place="tc"
          color="info"
          icon={AddAlert}
          message="Pedido salvo com sucesso!"
          open={this.state.alerta}
          closeNotification={() => this.setState({ alerta: false })}
          close
        />
      </div>
    );
  }
}

export default withStyles(styles)(OrderNew);
