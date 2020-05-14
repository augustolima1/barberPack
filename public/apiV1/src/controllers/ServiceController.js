const path = require('path');
const conn= require(`${path.resolve(__dirname, '../database/conn')}`);


module.exports = {

    async index(resquest,response){ 
 
        const services= await conn("services").select(['id','description','value']).orderBy('description', 'asc');

        return response.json(services);
    },

    
    async cerate(resquest,response){
        const {description,value} =resquest.body;
        
        const [id] =await conn("services").insert({
                description,
                value
        });
    
        return response.json({ id });
    },

    async delete(request, response) {
        const { id } = request.params;
      
        await conn('services').where('id', id).delete();
   
        return response.status(204).send();
   },
   
    async update(resquest, response) {       
            const {id,description,value} =resquest.body;
        
            await conn('services').where('id', id).update({
                    description,
                    value
            });

        return response.json({id});
    }      
    
    

}