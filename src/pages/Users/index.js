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



export default function Users() {
  const classes           = useStyles();
  const initalValues={
      id:null,
      name:'',
      password:'',  
  }
  const [values, setValues] = useState(initalValues);
  const [data, setData]     = useState([]);

  const [lblButton, setLblButton] = useState('Cadastrar');

  useEffect(() => {
    api.get('users').then(response => {
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
            const response= await api.post('users',values);
            const resp    = {...values,id:response.data.id};
 
            setData([resp,...data]);
            setValues(initalValues);
            handleNotification("Um novo usuário foi cadastrado",`O serviço ${values.name} foi cadastrado`);

          }catch (err) {
              alert('Erro ao cadastrar o usuário, tente novamente.');
          }
  }

  

  
  async function handleUpdate() {
    
          try {
              const response = await api.put('users',values);
              const _data    = data.filter(_data =>_data.id!== parseInt(values.id));
              const resp     = {...values,id:response.data.id};
 
              setData([resp,..._data]);
              setValues(initalValues);

              handleNotification("Um usuário foi atualizado",`O usuário ${values.name} foi Atulizado`);
               
              setLblButton("Cadastrar");

          } catch (err) {
              alert('Erro ao atulizar o usuário, tente novamente.');
          }
  }


  async function handleDelete(id) {

        var r = window.confirm("Tem certeza que deseja deletar?");
        
        if (!r)  return;

        try {
              await api.delete(`users/${id}`);
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
    <Header title={"Usuário"}/> 
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
          label="Senha" 
          variant="outlined"
          name="password"
          value={values.password}
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
      title={["Ação","Nome","Senha"]}
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
