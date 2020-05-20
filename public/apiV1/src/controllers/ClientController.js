const moment = require('moment');
const path = require('path');
const conn= require(`${path.resolve(__dirname, '../database/conn')}`);


async function getClient(client_id){
      const client= await conn("client")
            .leftJoin('client_plan','client_plan.client_id', '=','client.id') 
            .leftJoin('plans','plans.id','=','client_plan.plan_id')
            .where('client.id', client_id) 
            .select([
                'client.id',
                'name',
                'phone',
                'plans.description',
                'client_plan.expiration_day'
                ])
                .groupBy('client.id')
                .orderBy('name', 'asc')

    return client;        
}

module.exports = {
 

    async index(resquest,response){ 
  

        const client= await conn({a:"client"})
                .leftJoin({b:'client_dependent'},'b.dependente_id', '=','a.id')
                .leftJoin({c:'client_plan'},function() {
                            this.on('c.client_id', '=','a.id').orOn('c.client_id', '=','b.client_id')
                })
                .leftJoin({d:'plans'},'d.id','=','c.plan_id') 
                .leftJoin({e:'client'},'e.id','=','b.client_id') 
                .select([
                    'a.id',
                    'a.name',
                    'a.phone',
                    'd.description',
                    'c.expiration_day',
                    'e.name as holder'
                ])
                .groupBy('a.id')
                .orderBy('a.name', 'asc');

            
             return response.json(client);
    },

    
  
    

    async cerate(resquest,response){
        const {name,phone,plan_id,expiration_day,form_payment_id} =resquest.body;
        
        let error_msg=false;  

        if (!name)
            error_msg='Infome o nome do cliente';
        else if (!form_payment_id)
            error_msg='Infome a forma de pagamento';         
        
        if(error_msg)   
            return response.status(401).json({ error:error_msg});


        const [id] =await conn("client").insert({
                name,
                phone,
                form_payment_id,
                active:'1'
        });

        let client_id=id;

        if(plan_id){

              const {value}= await conn("plans").where('id', plan_id).select(['value']).first();
    
              await conn("client_plan").insert({
                                client_id,
                                plan_id,
                                expiration_day,
                                value,
                                active:'1',
                                
                    });
                    
                    await conn("client_payment").insert({
                        client_id,
                        year:moment().format('YYYY')
                                
                    });        
      }


        const client= await getClient(client_id);

        return response.json(client);
    
    },


    async delete(request, response) {
         const { id } = request.params;
       
         await conn('client').where('id', id).delete();
         await conn('client_plan').where('client_id', id).delete();
         await conn('client_payment').where('client_id', id).delete();
    
         return response.status(204).send();
    },
    
    async update(resquest, response) {
        
         const {id,name,phone,plan_id,expiration_day,form_payment_id} =resquest.body;

         let error_msg=false;  

         if (!name)
             error_msg='Infome o nome do cliente';
        
         
         if(error_msg)   
             return response.status(401).json({ error:error_msg});

      
         await conn('client').where('id', id).update({
                    name,
                    phone,
                    form_payment_id,
                    active:'1'
         });
        
         let client_id=id;

        
         const [count]= await conn("client_plan").where('client_id', client_id).count();
         
         
         
         if(count>0){
            await conn("client_plan").where('client_id', client_id).update({
                        plan_id,
                        expiration_day                        
            }); 
       
         }else if(plan_id){

                 const {value}= await conn("plans").where('id', plan_id).select(['value']).first();
  
                 await conn("client_plan").insert({
                              client_id,
                              plan_id,
                              expiration_day,
                              value,
                              active:'1'                              
                  });
                  
                  await conn("client_payment").insert({
                      client_id,
                      year:moment().format('YYYY')
                              
                  });        
         }

        const client= await getClient(client_id);


        return response.json(client);
   }  

};