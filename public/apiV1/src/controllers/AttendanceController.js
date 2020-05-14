const moment = require('moment');
const path = require('path');
const conn= require(`${path.resolve(__dirname, '../database/conn')}`);


async function getAttendanceItems(attendance_id){
    const attendance_items= await conn("services")
                    .join('attendance_items','attendance_items.service_id', '=','services.id')
                    .join('employee','employee.id', '=','attendance_items.employee_id')
                    .where('attendance_id',attendance_id)
                    .select([
                        'attendance_items.id',
                        'services.description',
                        'employee.name',
                        'attendance_items.date'
                    ])
                    .orderBy('attendance_items.id', 'desc');

           

        var attendance_itemsObj = attendance_items.map(function(row) {
                return  {...row,date:moment(row.date).format('DD/MM/YYYY')}
        });

    return attendance_itemsObj;
}



module.exports = {

    async index(resquest,response){ 
 
         const attendance= await conn("attendance")
                .join('client','client.id', '=','attendance.client_id')
                .select([
                    'attendance.id',
                    'name',
                    'date'
                ])
                .orderBy('name', 'asc');

          var attendanceObj = attendance.map(function(row) {
                    return  {...row,date:moment(row.date).format('DD/MM/YYYY')}
            });                

         return response.json(attendanceObj);
    },


    async attendanceItems(request,response){ 
            const { attendance_id } = request.params;

           
            const attendance= await conn("attendance")
                        .join('client','client.id', '=','attendance.client_id')
                        .where('attendance.id',attendance_id)
                        .select([
                            'attendance.id',
                            'client_id',
                            'name',
                            'phone',
                            'date'
                        ]).first();

            const attendance_items= await getAttendanceItems(attendance_id);

        return response.json({
                 attendance:attendance,
                 attendance_items:attendance_items
        });
   },    
    
    
    async cerate(resquest,response){
        
         const {id,client_id,date,service_id,employee_id} =resquest.body;

        let attendance_id=id;        
        let error_msg   =false;  

        if (!client_id)
            error_msg='Infome o cliente';
        else if (!date)
            error_msg='Infome a data';
        else if (!service_id)
            error_msg='Infome o serviço';
        else if (!employee_id)
            error_msg='Infome o profissional';   
        
        if (error_msg)   
            return response.status(401).json({ error:error_msg});         

        if(!attendance_id){
                    const [id] = await conn("attendance").insert({
                            client_id,
                            date
                    });
            
            attendance_id=id;
        }
       


        const  employee = await conn("employee")
                               .select([
                                    "commission",
                                    "rate_card"
                                ]) 
                               .where('employee.id',employee_id).first();
                

        var PlanItemsCount = conn('plan_items')
                            .count('*')
                            .where('plan_items.plan_id', conn.ref('d.id'))
                            .as('PlanItemsCount');

        const  infoPlan = await conn({a:"client"})
                        .leftJoin({b:'client_dependent'},'b.dependente_id', '=','a.id')
                        .leftJoin({c:'client_plan'},function() {
                            this.on('c.client_id', '=','a.id').orOn('c.client_id', '=','b.client_id')
                        })
                        .leftJoin({d:'plans'},'d.id', '=','c.plan_id')
                        .leftJoin({e:'form_payment'},'e.id', '=','a.form_payment_id')
                        .where('a.id',client_id)
                        .select([
                             'd.id',
                             'd.value',
                             'e.rate',
                              PlanItemsCount
                            ])
                        .first();
         
         let serviceValue      =infoPlan.value/infoPlan.PlanItemsCount;  
         let serviceRate       =(serviceValue*(infoPlan.rate/100))*(employee.rate_card/100); 
         let serviceCommission =serviceValue*(employee.commission/100)-serviceRate
                      
          
          
         
           await conn("attendance_items").insert({
                            attendance_id,
                            service_id,
                            employee_id,
                            client_id,
                            plan_id:infoPlan.id,
                            value:serviceValue,
                            rate:serviceRate,
                            commission:serviceCommission,
                            date
                });

        
        const attendance_items= await getAttendanceItems(attendance_id);
                 
        return response.json({
                       id:attendance_id,
                       attendance:attendance_items
         }); 
    },

    async delete(request, response) {
        const { id } = request.params;
      
        await conn('attendance').where('id', id).delete(); 
        await conn('attendance_items').where('attendance_id', id).delete(); 
   
        return response.status(204).send();
   },

    async deleteItem(request, response) {
        const { id } = request.params;
      
        await conn('attendance_items').where('id', id).delete(); 
   
        return response.status(204).send();
   },


    async client(request,response){ 
        const { id } = request.params;

        const client= await conn({a:"client"})
                   .leftJoin({b:'client_dependent'},'b.dependente_id', '=','a.id')
                   .leftJoin({c:'client_plan'},function() {
                       this.on('c.client_id', '=','a.id').orOn('c.client_id', '=','b.client_id')
                    })
                    .leftJoin({d:'plans'},'d.id', '=','c.plan_id')                    
                    .whereNotNull('d.id')
                    .select([
                          'a.id', 
                          'a.name',
                          'a.phone',
                          'c.id as plan_id'
                     ])
                     .orderBy('a.name', 'asc');
                      
                      

        return response.json(client);
    }, 
     
    
    async services_teste(request,response){ 
        const { client_id } = request.params;
      
        const services= await await conn({a:"client"})
                .leftJoin({b:'client_dependent'},'b.dependente_id', '=','a.id')
                .leftJoin({c:'client_plan'},function() {
                     this.on('c.client_id', '=','a.id').orOn('c.client_id', '=','b.client_id')
                 })
                 .leftJoin({d:'plan_items'}, 'd.plan_id','=','c.plan_id')
                 .leftJoin({e:'services'},   'e.id','=','d.service_id')                 
                 .where('a.id', client_id)
                 .select([
                       'e.id',
                       'e.description',
                  ])
                  .orderBy('e.description', 'asc');




        return response.json(services);
    },     



    async services(request,response){ 
        const { client_id } = request.params;
       
      
        const services= await await conn({a:"client"})
                        .leftJoin({b:'client_dependent'},'b.dependente_id', '=','a.id')
                        .leftJoin({c:'client_plan'},function() {
                            this.on('c.client_id', '=','a.id').orOn('c.client_id', '=','b.client_id')
                        })
                        .leftJoin({d:'plan_items'},       'd.plan_id',   '=','c.plan_id')
                        .leftJoin({e:'services'},         'e.id',        '=','d.service_id') 
                        .leftJoin({f:'attendance_items'}, 'f.service_id','=','d.service_id')
                        .leftJoin({g:'attendance'},function() {
                            this.on('g.id', '=','f.attendance_id').andOn('g.client_id', '=','a.id')
                        }) 
                        .where('a.id', client_id)
                        .groupBy('e.id')
                        .select([
                                'e.id', 
                                'e.description',
                                'd.amount',
                        ]).count('f.service_id as amount_used')
                          .orderBy('e.description', 'asc')
                        
                
            
             var servicesObj = services.map(function(row) {
                      let balance=row.amount-row.amount_used 

                      const {amount,amount_used, ...obj} = {...row,balance}
                      
                      return obj;
              });

              servicesObj=servicesObj.filter((row)=> row.balance>0);
 


        return response.json(servicesObj);
    }, 

}