import React,{useState,useEffect}    from 'react';
import {useParams }                  from "react-router-dom";
import {TextField,Button,MenuItem}   from '@material-ui/core';
import { makeStyles }                from '@material-ui/core/styles';
import SaveIcon                      from '@material-ui/icons/Save';
import IconButton                    from '@material-ui/core/IconButton';
import DeleteIcon                    from '@material-ui/icons/Delete'; 
import ArrowBackIcon                 from '@material-ui/icons/ArrowBack';
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


export default function Dependent() {
  const { id } = useParams();

  const classes             = useStyles();
  const initalValues={
      id:null,
      dependente_id:'',
      client_id: parseInt(id)
  }
  const [values, setValues]             = useState(initalValues);
  const [data, setData]                 = useState([]);
  const [client, setClient]             = useState([]);
  const [filterClient, setFilterClient] = useState({name:''});
  const [lblButton, setLblButton]       = useState('Adicionar');


   useEffect(() => {
            api.get(`dependent/${id}`).then(response => {
                setData(response.data);
            })

            api.get(`dependent/list/${id}`).then(response => {
                setClient(
                      response.data.filter(data=>data.id!== parseInt(id))
                    );

                setFilterClient(filterByClient(response.data));
            })

   }, []);

   
   const  filterByClient=(data)=>{
          return data.filter(_data =>_data.id== parseInt(id)).shift();         
   }

     

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
          
          try {
            const response= await api.post('dependent',values)
                   .catch(err=> alert(`Atenção, ${err.response.data.error}`) 
            );
            
            setClient(
                client.filter(data=>data.id!== parseInt(values.dependente_id))
            );
  
            setData([...response.data]);
            setValues(initalValues);
            handleNotification("Um novo dependente foi cadastrado");
          }catch(err) {
              alert('Erro ao cadastrar o dependente, tente novamente.');
          }
  }

 
  async function handleDelete(id) {

    var r = window.confirm("Tem certeza que deseja deletar?");
    
    if (!r)  return;

        try {
                await api.delete(`dependent/${id}`);
                setData(data.filter(_data =>_data.id!== parseInt(id)));              
                handleNotification("Atenção","Registro excluído com sucesso");
        }catch(err){
                alert('Erro ao deletar o dependente, tente novamente.');
        }
     
  }

   
 
  return (
    <>
    <Header title={`${filterClient.name} -> Dependentes`}/> 
    <section className="context">
            <div className="form"> 
    <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
      <div style={{marginBottom:"8px"}}>
        
        <TextField  
          label="Dependente"  
          select  
          variant="outlined" 
          style={{width:"300px"}}
          name="dependente_id"
          value={values.dependente_id}
          onChange={handleChange}
          >
           <MenuItem value="0">-</MenuItem>
          {client.map((row)=>(
                 <MenuItem value={row.id}>{row.name} - telefone: {row.phone}</MenuItem>
          ))}  
       </TextField>

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
        onClick={()=>history.push('/client')}
       >
        Voltar
      </Button>  

      </div>
    </form>
    <CustomPaginationActionsTable 
      data={data} 
      title={["Ação","Nome","Telefone"]}
      actionBody={
            <>
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
