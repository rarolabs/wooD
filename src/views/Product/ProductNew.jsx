import React, { PureComponent } from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import AddAlert from "@material-ui/icons/AddAlert";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
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

class ProductNew extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      madeira: "",
      quantidade: "",
      data: new Date(),
      alerta: false,
      nomeFazenda: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { madeira, quantidade, nomeFazenda } = this.state;
    myContractInstance.addWoodLot(
      madeira,
      quantidade.toString(),
      nomeFazenda,
      { from: window.acc },
      (err, res) => {
        if (!err) {
          this.setState({ alerta: true }, () => {
            setTimeout(() => {
              this.props.history.goBack();
            }, 1000);
          });
        } else {
          this.props.history.goBack();
        }
      }
    );
  };

  render() {
    const { classes } = this.props;
    const { madeira, quantidade, nomeFazenda } = this.state;
    return (
      <div>
        <GridContainer>
          <form style={{ display: "contents" }}>
            <GridItem xs={12} sm={12} md={8}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Cadastrar Lote</h4>
                  <p className={classes.cardCategoryWhite}>Informe os dados</p>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <CustomInput
                        labelText="Madeira"
                        id="madeira"
                        value={madeira}
                        onChange={this.handleChange}
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <CustomInput
                        labelText="Qunatidade Produzida (m3)"
                        id="quantidade"
                        value={quantidade}
                        onChange={this.handleChange}
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <CustomInput
                        labelText="Nome da Fazenda"
                        id="nomeFazenda"
                        value={nomeFazenda}
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
          </form>

        </GridContainer>
        <Snackbar
          place="tc"
          color="info"
          icon={AddAlert}
          message="Produto salvo com sucesso!"
          open={this.state.alerta}
          closeNotification={() => this.setState({ alerta: false })}
          close
        />
      </div>
    );
  }
}

export default withStyles(styles)(ProductNew);
