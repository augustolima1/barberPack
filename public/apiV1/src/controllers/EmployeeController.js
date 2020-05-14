const path = require('path');
const conn= require(`${path.resolve(__dirname, '../database/conn')}`);


module.exports = {

    async index(resquest,response){ 
 
        const employee= await conn("employee").select(['id','name','phone','commission','rate_card']);

        return response.json(employee);
    },

    
    async cerate(resquest,response){
        const {name,phone,commission,rate_card} =resquest.body;
        
        const [id] =await conn("employee").insert({
                name,
                phone,
                commission,
                rate_card
        });
    
        return response.json({ id });
    },

    
    async delete(request, response) {
        const { id } = request.params;
      
        await conn('employee').where('id', id).delete();
   
        return response.status(204).send();
   },
   
    async update(resquest, response) {       
            const {id,name,phone,commission} =resquest.body;
        
            await conn('employee').where('id', id).update({
                            name,
                            phone,
                            commission,
                            rate_card
            });

        return response.json({id});
    } 
    
}