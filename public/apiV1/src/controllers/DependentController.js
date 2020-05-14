const path = require('path');
const conn= require(`${path.resolve(__dirname, '../database/conn')}`);

 

module.exports = {
  

    async list(request,response){ 
        const { id } = request.params;
 
        
                const client= await conn("client")
                .leftJoin('client_plan','client_plan.client_id', '=','client.id') 
                .leftJoin('plans','plans.id','=','client_plan.plan_id') 
                .select([
                    'client.id',
                    'name',
                    'phone',
                    'plans.description',
                    'client_plan.expiration_day'
                    ])
                .orderBy('name', 'asc');
                                

        return response.json(client);
    }, 

    async index(request,response){ 
        const { id } = request.params;

        const client_dependent= await conn("client_dependent")
                .leftJoin('client','client.id', '=','client_dependent.dependente_id')
                .where('client_dependent.client_id',id)
                .select([
                    'client_dependent.id',
                    'name',
                    'phone'
                    ])
                .orderBy('name', 'asc');

        return response.json(client_dependent);
    }, 


    async cerate(resquest,response){
        const {client_id,dependente_id} =resquest.body;

        let error_msg=false;  

        if (!client_id)
            error_msg='Infome o cliente';

        if (!dependente_id)
             error_msg='Infome o dependente';

        if(error_msg)   
             return response.status(401).json({ error:error_msg});             

        
        const [id] =await conn("client_dependent").insert({
             client_id,
             dependente_id
        });

        const client_dependent= await conn("client_dependent")
                .join('client','client.id', '=','client_dependent.dependente_id')
                .where('client_dependent.client_id',client_id)
                .select([
                    'client_dependent.id',
                    'name',
                    'phone'
                    ])
                .orderBy('name', 'asc')
                        
    
        return response.json(client_dependent);
    },
    
    
    async delete(request, response) {
        const { id } = request.params;
      
        await conn('client_dependent').where('id', id).delete();
   
        return response.status(204).send();
   },
   
     
}