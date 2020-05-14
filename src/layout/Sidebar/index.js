import React,{Component} from 'react';
import SideMenu from 'react-sidemenu';
import 'react-sidemenu/dist/side-menu.css';

import history from "../../services/history";
const hangle=(value)=>{
     history.push(value);
}
const items = [
  //{divider: true, label: 'Main navigation', value: 'main-nav'},
  {label: 'Home',              value: '/',            onClick:()=>hangle("/")  },
  {label: 'Atendimentos',      value: '/attendance',  onClick:()=>hangle("/attendance")},
  {label: 'Clientes',          value: '/client',      onClick:()=>hangle("/client")},
  {label: 'Serviços',          value: '/services',    onClick:()=>hangle("/services")},
  {label: 'Planos',            value: '/plans',       onClick:()=>hangle("/plans")},
  {label: 'Colaboradores',     value: '/employee',    onClick:()=>hangle("/employee")},
  {label: 'Usuários',          value: '/users',       onClick:()=>hangle("/users")},
  {label: 'Forma de Pagamento',value: '/payment/form',onClick:()=>hangle("/payment/form")},
  {label: 'Relatórios',        value: '/rel/comissao',
  children: [
    {label: 'Comissão',        value: '/rel/comissao' , onClick:()=>hangle("/rel/commission")}
  ] 
   }
  /*{label: 'item 2', value: 'item2', icon: 'fa-automobile',
  children: [
    {label: 'item 2.1', value: 'item2.1',
    children: [
      {label: 'item 2.1.1', value: 'item2.1.1'},
      {label: 'item 2.1.2', value: 'item2.1.2'}]},
    {label: 'item 2.2', value: 'item2.2'}]},
  {divider: true, label: 'Motors', value: 'motors-nav'},
  {label: 'item 3', value: 'item3', icon: 'fa-beer'}*/
];

class Sidebar extends Component {
  render() {
    return ( <nav className="navbar">
      <SideMenu items={items}/>
      </nav>);
  }
}


export default Sidebar;