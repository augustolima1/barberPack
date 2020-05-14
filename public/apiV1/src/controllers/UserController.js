const path = require('path');
const conn= require(`${path.resolve(__dirname, '../database/conn')}`);


module.exports = {
 
    async index(resquest,response){ 
 
        const users= await conn("users").select(['id','name']); 
        
        return response.json(users);
    }, 

    async cerate(resquest,response){
        const {name,password} =resquest.body;
        
        const [id] =await conn("users").insert({
             name,
             password
        });
    
        return response.json({ id });
    },
    
    
    async delete(request, response) {
        const { id } = request.params;
      
        await conn('users').where('id', id).delete();
   
        return response.status(204).send();
   },
   
    async update(resquest, response) {       
            const {id,name,password} =resquest.body;
        
            await conn('users').where('id', id).update({
                    name,
                    password
            });

        return response.json({id});
    } 
}