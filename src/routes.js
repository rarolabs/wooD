// @material-ui/icons
import Person from "@material-ui/icons/Person";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import TimelineIcon from "@material-ui/icons/Timeline";
// core components/views for Admin layout
import OrderIndex from "views/Orders/OrderIndex.jsx";
import OrderNew from "views/Orders/OrderNew.jsx";
import ProductIndex from "views/Product/ProductIndex.jsx";
import ProductNew from "views/Product/ProductNew.jsx";
import Timeline from "views/Timeline/Timeline.jsx";
import Shipment from "views/Shipment/Shipment.jsx";

const dashboardRoutes = [
  {
    path: "/products",
    name: "Lotes",
    icon: Person,
    component: ProductIndex,
    layout: "/admin",
    isMenu: true
  },
  {
    path: "/product/new",
    name: "Novo Lote",
    component: ProductNew,
    layout: "/admin",
    isMenu: false
  },
  {
    path: "/orders",
    name: "Pedidos",
    icon: ShoppingCart,
    component: OrderIndex,
    layout: "/admin",
    isMenu: true
  },
  {
    path: "/order/new",
    name: "Novo Pedido",
    component: OrderNew,
    layout: "/admin",
    isMenu: false
  },
  {
    path: "/shipment/:id",
    name: "Entrega",
    component: Shipment,
    layout: "/admin",
    isMenu: false
  },
  {
    path: "/timeline",
    name: "Timeline",
    icon: TimelineIcon,
    component: Timeline,
    layout: "/admin",
    isMenu: true
  }
];

export default dashboardRoutes;
