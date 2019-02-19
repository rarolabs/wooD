import React, { PureComponent } from "react";
import QRCode from "qrcode.react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Table from "components/Table/Table.jsx";
import { Link } from "react-router-dom";
import moment from "moment";
import Modal from "react-responsive-modal";

const woodLotJSON = require("build-contracts/WoodManager.json");
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
        resolve({
          madeira: res[0],
          quantidade: res[1],
          nomeFazenda: res[2],
          data: moment(res[3].toNumber() * 1000).format("DD/MM/YYYY hh:mm:ss")
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

class ProductIndex extends PureComponent {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      produtos: [],
      open: false,
      qrCode: ""
    };
  }

  componentDidMount() {
    if (window.web3 && window.web3.isConnected()) {
      myContractInstance.getNumberOfLots.call(async (err, res) => {
        if (!err && res) {
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
  }

  onOpenModal = qrCode => {
    this.setState({ open: true, qrCode });
  };

  onCloseModal = () => {
    this.setState({ open: false, qrCode: "" });
  };

  render() {
    const { classes } = this.props;
    const { produtos, open, qrCode } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12} style={{ textAlign: "right" }}>
            <Button component={Link} to="product/new" color="info">
              Novo
            </Button>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Lote</h4>
                <p className={classes.cardCategoryWhite}>
                  Listagem de todos os lotes
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={[
                    "#",
                    "Lote",
                    "Quantidade",
                    "Nome Fazenda",
                    "Data Criação",
                    "Ações"
                  ]}
                  tableData={produtos.map((prod, currentIndex) =>
                    [currentIndex].concat(Object.values(prod)).concat(
                      <Tooltip
                        id="tooltip-top-start"
                        title="QrCode"
                        placement="top"
                        classes={{ tooltip: classes.tooltip }}
                      >
                        <IconButton
                          aria-label="LocalShipping"
                          className={classes.tableActionButton}
                          onClick={() => this.onOpenModal("link")}
                        >
                          <QRCode value="" size={25} />
                        </IconButton>
                      </Tooltip>
                    )
                  )}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <Modal
          open={open}
          closeIconSize={60}
          onClose={this.onCloseModal}
          center
        >
          <div className="content-modal-qrcode">
            <QRCode value={qrCode} />
          </div>
        </Modal>
      </div>
    );
  }
}

export default withStyles(styles)(ProductIndex);
