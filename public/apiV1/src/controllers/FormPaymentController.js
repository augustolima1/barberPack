const path   = require('path');
const conn   = require(`${path.resolve(__dirname, '../database/conn')}`);

 

module.exports = {
    
  async index(resquest,response){ 
  
      const form_payment= await conn("form_payment").select(['id','description','rate']).orderBy('description', 'asc');

      return response.json(form_payment);
  },


  async cerate(resquest,response){
    const {description,rate} =resquest.body;

    let error_msg=false;  

    if (!description)
        error_msg='Infome a descrição';
   
    
    if(error_msg)   
        return response.status(401).json({ error:error_msg});

    
    const [id] =await conn("form_payment").insert({
         description,
         rate
    });

    

    return response.json({ id });
},


  async delete(request, response) {
      const { id } = request.params;
    
      await conn('form_payment').where('id', id).delete();

      return response.status(204).send();
  },

  async update(resquest, response) {       
    
          const {id,description,rate} =resquest.body;
      
          let error_msg=false;  

          if (!description)
              error_msg='Infome a descrição';
         
          
          if(error_msg)   
              return response.status(401).json({ error:error_msg});

              
          await conn('form_payment').where('id', id).update({
                  description,
                  rate
          });

      return response.json({id});
  }   
   
}