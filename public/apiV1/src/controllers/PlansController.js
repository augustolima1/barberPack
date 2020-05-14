const path = require('path');
const conn= require(`${path.resolve(__dirname, '../database/conn')}`);

 

module.exports = {

    async index(resquest,response){ 
 
        const plans= await conn("plans").select(['id','description','value']).orderBy('description', 'asc');

        return response.json(plans);
    },

    async cerate(resquest,response){
        const {id,description,value,amount,service_id} =resquest.body;
        
        let plan_id= id;
    
        if(!plan_id){
             const [id]=await conn("plans").insert({
                            description,
                            value 
              });

             plan_id=id;

        }else{
            await conn('plans').where('id', id).update({
                description,
                value
            });
        }

        if(service_id)
            await conn("plan_items").insert({
                    amount,
                    plan_id,
                    service_id
            });
    

        

           const services = await conn('services')
                .join('plan_items', 'plan_items.service_id', '=', 'services.id') 
                .where('plan_id', plan_id)
                .select([
                    'plan_items.id', 
                    'services.description', 
                    'plan_items.amount'
                 ]).orderBy('plan_items.id','desc');

            
    
        return response.json({
                           id:plan_id,
                           data:services
                          });
    },


    async delete(request, response) {
        const { id } = request.params;
      
        await conn('plans').where('id', id).delete();
        await conn('plan_items').where('plan_id', id).delete();
        await conn('client_plan').where('plan_id', id).delete();
   
        return response.status(204).send();
   },

   
    async update(resquest, response) {       
            const {id,description,amount,services_id} =resquest.body;
        
       await conn('plans').where('id', id).update({
                    description,
                    amount,
                    services_id
        });

        return response.json({id});
    },     

    
    
    async items(request,response){
        const { id } = request.params;
 
        const plans= await conn("plans").where('id', id).select(['id','description','value']).first();

        const services = await conn('services')
                    .join('plan_items', 'plan_items.service_id', '=', 'services.id') 
                    .where('plan_id', id)
                    .select([
                        'plan_items.id', 
                        'services.description', 
                        'plan_items.amount'
                    ]).orderBy('services.description', 'asc');

         return response.json({
                services:services,
                form:plans
            });
    },


    async deleteItem(request, response) {
        const { id } = request.params;
      
        await conn('plan_items').where('id', id).delete();
   
        return response.status(204).send();
   }
}