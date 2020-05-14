import React,{useState,useEffect}    from 'react';
import {TextField,Button }           from '@material-ui/core';
import { makeStyles }                from '@material-ui/core/styles';
import SaveIcon                      from '@material-ui/icons/Save';
import IconButton                    from '@material-ui/core/IconButton';
import DeleteIcon                    from '@material-ui/icons/Delete';
import EdiIcon                       from '@material-ui/icons/Edit';
import Header                        from '../../components/Header';
import CustomPaginationActionsTable  from '../../components/tables';

import  api           from '../../services/api';
 
const { ipcRenderer } = window.require("electron");


const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root +.MuiTextField-root,.MuiButton-root': {
      marginLeft: theme.spacing(1),
    }
  },
  
}));



export default function Employee() {
  const classes           = useStyles();
  const initalValues={
      id:null,
      name:'',
      phone:'',
      commission:'',
      rate_card:0
  }
  const [values, setValues] = useState(initalValues);
  const [data, setData]     = useState([]);

  const [lblButton, setLblButton] = useState('Cadastrar');

  useEffect(() => {
    api.get('employee').then(response => {
               setData(response.data);
    })

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

        if(!values.name) return;

         if(values.id)
            handleUpdate();
         else  
            handleNew();
                 
  }

  async function handleNew() {
          
          try {
            const response= await api.post('employee',values);
            const resp    = {...values,id:response.data.id};

            setData([resp,...data]);
            setValues(initalValues);
            handleNotification("Um novo colaborador foi cadastrado",`O colaborador ${values.name} foi cadastrado`);

          }catch (err) {
              alert('Erro ao cadastrar o colaborador, tente novamente.');
          }
  }

  

  
  async function handleUpdate() {
    
          try {
              const response = await api.put('employee',values);
              const _data    = data.filter(_data =>_data.id!== parseInt(values.id));
              const resp    = {...values,id:response.data.id};
 
              setData([resp,..._data]);
              setValues(initalValues);

              handleNotification("Um serviço foi atualizado",`O serviço ${values.name} foi Atulizado`);
               
              setLblButton("Cadastrar");

          } catch (err) {
              alert('Erro ao atulizar o serviço, tente novamente.');
          }
  }


  async function handleDelete(id) {

        var r = window.confirm("Tem certeza que deseja deletar?");
        
        if (!r)  return;

        try {
              await api.delete(`employee/${id}`);
              setData(data.filter(_data =>_data.id!== parseInt(id)));              
              handleNotification("Atenção","Registro excluído com sucesso");
          } catch (err) {
              alert('Erro ao deletar o serviço, tente novamente.');
          }
  
  }

  
  function handleGetUpdate(id) {
       const _data= data.filter(_data =>_data.id== parseInt(id));
       
       setValues({...initalValues,..._data[0]});
       
       setLblButton("Atualizar"); 
  }


 
  return (
    <>
    <Header title={"Colaboradores"}/> 
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
          label="Telefone" 
          variant="outlined"
          name="phone"
          value={values.phone}
          onChange={handleChange}
        />
        <TextField
          id="outlined-error-helper-text"
          label="Comissão %" 
          variant="outlined"
          name="commission"
          value={values.commission}
          onChange={handleChange}
        />

      <TextField
          style={{width:"120px"}}
          id="outlined-error-helper-text"
          label="Taxa Cartão %" 
          variant="outlined"
          name="rate_card"
          value={values.rate_card}
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
      </div>
    </form>
    <CustomPaginationActionsTable 
      data={data} 
      title={["Ação","Nome","Telefone","Comissão %","Taxa Cartão %"]}
      actionBody={
            <>
            <IconButton 
                style={{padding:"0 8px"}} 
                color="primary" 
                onClick={(e)=>handleGetUpdate(e.target.closest('tr').getAttribute('data-id'))}>
                <EdiIcon />
            </IconButton>
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
