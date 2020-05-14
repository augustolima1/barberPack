import React from "react";
import { Route,Switch} from "react-router-dom";

import Main              from "./pages/Main";
import Client            from "./pages/Client";
import Dependent         from "./pages/Client/dependent";
import Service           from "./pages/Services";
import Plans             from "./pages/Plans";
import NewPlans          from "./pages/Plans/new";
import Users             from "./pages/Users";
import Employee            from "./pages/Employee";
import Attendance          from "./pages/Attendance";
import AttendanceItems     from "./pages/Attendance/items";
import Commission          from "./pages/Commission";
import CommissionDetailed  from "./pages/Commission/detailed";

import FormPayment          from "./pages/FormPayment";


export default function Routes() {
  return (
   
    <Switch>
      <Route path="/"                                  exact component={Main} />
      <Route path="/attendance"                        exact component={Attendance} />
      <Route path="/attendance/items"                  exact component={AttendanceItems} />
      <Route path="/attendance/items/:attendance_id"   exact component={AttendanceItems} />

      <Route path="/client"                exact component={Client} />
      <Route path="/client/dependent/:id"  exact component={Dependent} />

      <Route path="/services"   exact component={Service} />
      
      <Route path="/plans"      exact component={Plans} />
      <Route path="/plans/new"  exact component={NewPlans} />
      <Route path="/plans/:id"    exact component={NewPlans} />

      <Route path="/payment/form" exact component={FormPayment} />

      <Route path="/users"      exact component={Users} />
      <Route path="/employee"   exact component={Employee} />
      
      <Route path="/rel/commission"           exact component={Commission} />
      <Route path="/rel/commission/detailed"  exact component={CommissionDetailed} />


      
      
      <Route path="/" component={() =><h1>Desculpe, um erro ocorreu. Estaremos verificando o que aconteceu.</h1>} />
    </Switch>
    
  );
}
