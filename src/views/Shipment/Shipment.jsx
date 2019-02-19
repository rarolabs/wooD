import React, { PureComponent } from "react";
import QRCode from 'qrcode.react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import FormLabel from '@material-ui/core/FormLabel';
// @material-ui/icons
import AddAlert from '@material-ui/icons/AddAlert';
// core components
import GridItem from 'components/Grid/GridItem.jsx';
import GridContainer from 'components/Grid/GridContainer.jsx';
import CustomInput from 'components/CustomInput/CustomInput.jsx';
import Button from 'components/CustomButtons/Button.jsx';
import Card from 'components/Card/Card.jsx';
import CardHeader from 'components/Card/CardHeader.jsx';
import CardBody from 'components/Card/CardBody.jsx';
import CardFooter from 'components/Card/CardFooter.jsx';
import Snackbar from 'components/Snackbar/Snackbar.jsx';
import CustomSelect from 'components/CustomSelect/CustomSelect.jsx';

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

class Shipment extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      id: '',
      lote: '',
      quantidade: '',
      destino: '',      
      situacaoEntrega: {},
      alerta: false
    };

  }

  componentWillMount() {
    const { match: { params } } = this.props;   
    
    myContractInstance.getWoodLot.call(params.id, (err, res) => {
      if(!err) {
        this.setState({
          id: params.id, lote: res[0], quantidade: res[1], destino: ''
        })
      } else {
        console.log(err)
      }
    });
  }

  handleChange = (event) => {
    if (event.target && event.target.name === 'situacaoEntrega') {
      this.setState({
          situacaoEntrega: event.target.value
      });
    } else {
      this.setState({
        [event.target.id]: event.target.value
      });
    }

  }

  handleSubmit = (event) =>{
    event.preventDefault();
    const { id, lote, destino, situacaoEntrega } = this.state;

    myContractInstance.registerLotShipment(id, destino, lote + " " + " " + destino, situacaoEntrega, { from: window.acc }, (err, res) => {
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
    
  }

  render() {
    const { classes } = this.props;
    const { lote, quantidade,  situacaoEntrega, destino } = this.state;

    return (
      <div>
        <GridContainer>

          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Pedido </h4>
                <p className={classes.cardCategoryWhite}>Dados do pedido</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Lote"
                      id="lote"
                      value={lote}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Quantidade (m3)"
                      id="quantidade"
                      value={quantidade}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true
                      }}
                    />
                  </GridItem>                  
                </GridContainer>

                <br/>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <FormLabel component="legend">Dados da Entrega</FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomSelect
                      labelText="Situação Entrega"
                      id="situacaoEntrega"
                      value={situacaoEntrega}
                      onChange={this.handleChange}
                      list={[{id: 1, name: 'Em Trânsito'}, {id: 2, name: 'Entregue'}]}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
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
                <Button onClick={this.handleSubmit} color="primary">Salvar</Button>
                <Button onClick={() => this.props.history.goBack()}>Cancelar</Button>
              </CardFooter>
            </Card>
          </GridItem>

          <GridItem xs={12} sm={12} md={4}>
            <Card profile>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>QRCode</h4>
                <p className={classes.cardCategoryWhite}>QRCode para rastreio da madeira</p>
              </CardHeader>
              <CardBody profile>
                {/* <h6 className={classes.cardCategory}>Rastreio</h6> */}
                <p className={classes.description}>
                  <QRCode value="http://facebook.github.io/react/" />
                </p>
              </CardBody>
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

export default withStyles(styles)(Shipment);
