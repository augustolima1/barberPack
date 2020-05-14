import React,{useState,useEffect}    from 'react';
import {TextField,Button,MenuItem}   from '@material-ui/core';
import { makeStyles }                from '@material-ui/core/styles';
import SaveIcon                      from '@material-ui/icons/Save';
import IconButton                    from '@material-ui/core/IconButton';
import DeleteIcon                    from '@material-ui/icons/Delete';
import GroupAddIcon                  from '@material-ui/icons/GroupAdd';
import EdiIcon                       from '@material-ui/icons/Edit';
import Header                        from '~/components/Header';
import CustomPaginationActionsTable from  '~/components/tables';

import  api           from '~/services/api';
import  history       from '~/services/history';



const { ipcRenderer } = window.require("electron");


const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root +.MuiTextField-root,.MuiButton-root': {
      marginLeft: theme.spacing(1),
    }
  },
  
}));

export default function Cliente() {
  const classes             = useStyles();
  const initalValues={
      id:null,
      name:'',
      phone:'',
      plan_id:0,
      expiration_day:'' 
  }
  const [values, setValues]           = useState(initalValues);
  const [data,   setData]             = useState([]);
  const [plans,  setPlans]            = useState([]);
  const [formPayment,setFormPayment]  = useState([]);

  const [lblButton, setLblButton] = useState('Cadastrar');

  useEffect(() => {
    api.get('client').then(response => setData(response.data));

    api.get('plans').then(response => setPlans(response.data));

    api.get('/payment/form').then(response => setFormPayment(response.data));    

  }, []);

  

  const handleChange = (event) => {
      setValues({
         ...values,
         [event.target.name]: event.target.value,
      });
  };
  

  const handleNotification=(title,body)=>{
      const message = {
          title: title,
          body: body
      };

      ipcRenderer.send("@notification/REQUEST", message);
  }


  function handleSubmit(e){
         e.preventDefault(); 

         if(values.id)
            handleUpdate();
         else  
            handleNew();
                 
  }

  async function handleNew() {
          
          try {

            values.expiration_day=parseInt(values.expiration_day);
            values.plan_id=parseInt(values.plan_id);

            const response= await api.post('client',values)
                    .catch(err=> alert(`Atenção, ${err.response.data.error}`) 
            );            
            
            setData([...response.data,...data]);
            setValues(initalValues);
            handleNotification("Um novo cliente foi cadastrado",`O cliente ${values.name} foi cadastrado`);

          }catch(err) {
              //alert('Erro ao cadastrar o cliente, tente novamente.');
          }
  }

  

  
  async function handleUpdate() {
    
          try {
              values.expiration_day=parseInt(values.expiration_day);
              values.plan_id=parseInt(values.plan_id);

              const response= await api.put('client',values)
                   .catch(err=> alert(`Atenção, ${err.response.data.error}`) 
              );            
              const _data = data.filter(_data =>_data.id!== parseInt(values.id));

              setData([...response.data,..._data]);
              setValues(initalValues);
              handleNotification("Um cliente foi atualizado",`O cliente ${values.name} foi Atulizado`);               
              setLblButton("Cadastrar");
          } catch (err) {
              //alert('Erro ao atulizar o cliente, tente novamente.');
          }
  }


  async function handleDelete(id) {

    var r = window.confirm("Tem certeza que deseja deletar?");
    
    if (!r)  return;

       try {
              await api.delete(`client/${id}`);
              setData(data.filter(_data =>_data.id!== parseInt(id)));              
              handleNotification("Atenção","Registro excluído com sucesso");
          } catch (err) {
              alert('Erro ao deletar o cliente, tente novamente.');
          }
     
    }

  
  function handleGetUpdate(id) {
       const _data= data.filter(_data =>_data.id== parseInt(id));
       
       setValues({...initalValues,..._data[0]});
       
       setLblButton("Atualizar"); 
  }


 
  return (
    <>
    <Header title={"Clientes"}/> 
    <section className="context">
            <div className="form"> 
    <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
      <div style={{marginBottom:"8px"}}>
        <TextField
          label="Nome" 
          variant="outlined"
          name="name"
          value={values.name}
          onChange={handleChange}
        />
        <TextField
          id="outlined-error-helper-text"
          style={{width:"200px"}}
          label="Telefone" 
          variant="outlined"
          name="phone"
          value={values.phone}
          onChange={handleChange}
        />

        <TextField  
          label="Plano"  
          select  
          variant="outlined" 
          style={{width:"200px"}}
          name="plan_id"
          value={values.plan_id}
          onChange={handleChange}
          >
           <MenuItem value="0">-</MenuItem>
          {plans.map((row)=>(
                 <MenuItem value={row.id}>{row.description} - {row.value}</MenuItem>
          ))}  
       </TextField>

       <TextField  
          label="Forma de Pagmento"  
          select  
          variant="outlined" 
          style={{width:"200px"}}
          name="form_payment_id"
          value={values.form_payment_id}
          onChange={handleChange}
          >
           <MenuItem value="0">-</MenuItem>
          {formPayment.map((row)=>(
                 <MenuItem value={row.id}>{row.description}</MenuItem>
          ))}  
       </TextField>

       
       <TextField 
          label="Dia de vencimento" 
          style={{width:"170px"}}
          variant="outlined"
          name="expiration_day"
          value={values.expiration_day}
          onChange={handleChange}
        />
       

      <Button
        style={{margin:"12px 0"}} 
        variant="contained"
        color="primary"
        size="large"
        startIcon={<SaveIcon />}
        type="submit"
       >
        {lblButton}
      </Button>
      </div>
    </form>
    <CustomPaginationActionsTable 
      data={data} 
      title={["Ação","Nome","Telefone","Plano","Dia de Vencimento","Titular do Plano"]}
      actionBody={
            <>
            
            <IconButton 
                style={{padding:"0 8px"}} 
                color="primary"
                title="Adicionar Dependente" 
                onClick={(e)=>history.push(`/client/dependent/${e.target.closest('tr').getAttribute('data-id')}`)}
                >
                <GroupAddIcon />
            </IconButton>

            <IconButton 
                style={{padding:"0 8px"}} 
                color="primary" 
                title="Editar" 
                onClick={(e)=>handleGetUpdate(e.target.closest('tr').getAttribute('data-id'))}>
                <EdiIcon />
            </IconButton>
            <IconButton 
               style={{padding:"0 8px"}} 
               color="secondary" 
               title="Remover" 
               onClick={(e)=>handleDelete(e.target.closest('tr').getAttribute('data-id'))}>
                <DeleteIcon />
            </IconButton>
            </>
          }
      />
      </div>
      </section>
    </>
  );
}
