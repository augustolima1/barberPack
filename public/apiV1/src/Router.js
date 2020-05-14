const express = require('express');

const userController        = require('./controllers/UserController');
const clientController      = require('./controllers/ClientController');
const dependentController   = require('./controllers/DependentController');
const employeeController    = require('./controllers/EmployeeController');
const plansController       = require('./controllers/PlansController');
const serviceController     = require('./controllers/ServiceController');
const attendanceController  = require('./controllers/AttendanceController');

const commissionController  = require('./controllers/CommissionController');
const formPaymentController = require('./controllers/FormPaymentController');

const router =express.Router();
 

router.get('/', function (req, res) {
    res.send('Hello World!');
});


router.get('/users',userController.index);
router.post('/users',userController.cerate);
router.put('/users',userController.update);
router.delete('/users/:id',userController.delete);

router.get('/attendance'                     ,attendanceController.index);
router.get('/attendance/client'              ,attendanceController.client);
router.get('/attendance/services/:client_id' ,attendanceController.services);
router.get('/attendance/items/:attendance_id',attendanceController.attendanceItems);
router.post('/attendance'                    ,attendanceController.cerate);
router.delete('/attendance/:id'              ,attendanceController.delete);
router.delete('/attendance/item/:id'         ,attendanceController.deleteItem);
router.get('/attendance/all/:client_id'      ,attendanceController.services_teste);

router.get('/commission'                     ,commissionController.index);
router.get('/commission/detailed'            ,commissionController.detailed);
 


router.get('/payment/form',formPaymentController.index);
router.post('/payment/form',formPaymentController.cerate);
router.put('/payment/form',formPaymentController.update);
router.delete('/payment/form/:id',formPaymentController.delete);



router.get('/client',clientController.index);
router.post('/client',clientController.cerate);
router.put('/client',clientController.update);
router.delete('/client/:id',clientController.delete);

router.get('/dependent/:id',dependentController.index);
router.get('/dependent/list/:id',dependentController.list);
router.post('/dependent',dependentController.cerate);
router.delete('/dependent/:id',dependentController.delete);

router.get('/employee',employeeController.index);
router.post('/employee',employeeController.cerate);
router.put('/employee',employeeController.update);
router.delete('/employee/:id',employeeController.delete);


router.get('/plans',plansController.index);
router.post('/plans',plansController.cerate);
router.put('/plans',plansController.update);
router.delete('/plans/:id',plansController.delete);
router.get('/plans/items/:id',plansController.items);
router.delete('/plans/item/:id',plansController.deleteItem);



router.get('/service',serviceController.index);
router.post('/service',serviceController.cerate);
router.put('/service',serviceController.update);
router.delete('/service/:id',serviceController.delete);

module.exports=router;