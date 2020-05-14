import React,{useState,useEffect}    from 'react';
import {useParams }                  from "react-router-dom";
import {TextField,Button,MenuItem }  from '@material-ui/core';
import { makeStyles }                from '@material-ui/core/styles';
import SaveIcon                      from '@material-ui/icons/Save';
import ArrowBackIcon                 from '@material-ui/icons/ArrowBack';
import IconButton                    from '@material-ui/core/IconButton';
import DeleteIcon                    from '@material-ui/icons/Delete';
import Header                        from '~/components/Header';
import CustomPaginationActionsTable  from '~/components/tables';

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



export default function Plans() {
  const classes           = useStyles();
  const initalValues={
      id:null,
      description:'',
      value:'',
      amount:'', 
      service_id:''
  }

  const [values, setValues]      = useState(initalValues);
  const [data, setData]          = useState([]);
  const [services, setService]   = useState([]);
  const [disabled, setDisabled]  = useState(false);

  const [lblButton, setLblButton] = useState('Cadastrar');

   const { id } = useParams();
 
  useEffect(() => {
      api.get('service').then(response => {
            setService(response.data);
      })
      
      if(id)
        api.get(`plans/items/${id}`).then(response => {
              setData(response.data.services);
              setValues(response.data.form);
              //setDisabled(true);
              
        }).catch(err=>history.push('/plans'))

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



   

  async function handleSubmit(e) {
          e.preventDefault(); 

          if(!values.description) return;
          
          try {
            const response= await api.post('plans',values);
            const resp    = {
                         ...values,
                         id:response.data.id, 
                         amount:'',
                         service_id:'' 
             }; 

            //setDisabled(true);
            setData(response.data.data);
            setValues(resp);

            handleNotification("Um novo registro foi cadastrado",'Registro Cadastrado com sucesso!');

          }catch (err) {
              alert('Erro ao cadastrar o plano, tente novamente.');
          }
  }

  

  async function handleDelete(id) {

        var r = window.confirm("Tem certeza que deseja deletar?");
        
        if (!r)  return;

        try {
              await api.delete(`plans/item/${id}`);

              setData(data.filter(ret => ret.id !== parseInt(id) ));
              handleNotification("Atenção","Registro excluído com sucesso");
            }catch (err) {
              alert('Erro ao deletar o serviço, tente novamente.');
            }
  
  }
 
 
 
  return (
    <>
    <Header title={"Novo Plano"}/> 
    <section className="context">
            <div className="form"> 
    <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
      <div style={{marginBottom:"8px"}}>
        <TextField
          label="Descrição do plano" 
          variant="outlined"
          name="description"
          value={values.description}
          onChange={handleChange}
          disabled={disabled}
        />
        <TextField
          id="outlined-error-helper-text"
          label="Valor do plano" 
          variant="outlined"
          name="value"
          value={values.value}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
      <h2>Itens do plano</h2>
      <div style={{marginBottom:"8px"}}>
       
       <TextField  
          label="Serviço"  
          select  
          variant="outlined" 
          style={{width:"200px"}}
          name="service_id"
          value={values.service_id}
          onChange={handleChange}
          >
          {services.map((row)=>(
                 <MenuItem value={row.id}>{row.description}</MenuItem>
          ))}  
         
       </TextField>

        <TextField
          id="outlined-error-helper-text"
          label="Quantidade" 
          variant="outlined"
          name="amount"
          value={values.amount}
          onChange={handleChange}
        />
       
      
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<SaveIcon />}
        type="submit"
       >
        {lblButton}
      </Button>

      <Button
        variant="contained"
        color="secondary"
        size="large"
        startIcon={<ArrowBackIcon/>}
        onClick={()=>history.push('/plans')}
       >
        Voltar
      </Button>       
      </div>
    </form>
    <CustomPaginationActionsTable 
      data={data} 
      title={["Ação","Serviço","Quantidade"]}
      actionBody={
            <>
            <IconButton 
               style={{padding:"0 8px"}} 
               color="secondary" 
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
