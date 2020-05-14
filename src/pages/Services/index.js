import React,{useState,useEffect}    from 'react';
import {TextField,Button }           from '@material-ui/core';
import { makeStyles }                from '@material-ui/core/styles';
import SaveIcon                      from '@material-ui/icons/Save';
import IconButton                    from '@material-ui/core/IconButton';
import DeleteIcon                    from '@material-ui/icons/Delete';
import EdiIcon                       from '@material-ui/icons/Edit';
import Header                        from '~/components/Header';
import CustomPaginationActionsTable  from '~/components/tables';
import  api                          from '~/services/api';
 
const { ipcRenderer } = window.require("electron");


const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root +.MuiTextField-root,.MuiButton-root': {
      marginLeft: theme.spacing(1),
    }
  },
  
}));



export default function Services() {
  const classes           = useStyles();
  const initalValues={
      id:null,
      description:'',
      value:'', 
  }
  const [values, setValues] = useState(initalValues);
  const [data, setData]     = useState([]);

  const [lblButton, setLblButton] = useState('Cadastrar');

  useEffect(() => {
    api.get('service').then(response => {
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

        if(!values.description) return;

         if(values.id)
            handleUpdate();
         else  
            handleNew();
                 
  }

  async function handleNew() {
          
          try {
            const response= await api.post('service',values);
            const resp    = {id:response.data.id,description:values.description,value:values.value};
         
            setData([resp,...data]);
            setValues(initalValues);
            handleNotification("Um novo serviço foi cadastrado",`O serviço ${values.description} foi cadastrado`);

          }catch (err) {
              alert('Erro ao cadastrar o serviço, tente novamente.');
          }
  }

  

  
  async function handleUpdate() {
    
          try {
              const response = await api.put('service',values);
              const _data    = data.filter(_data =>_data.id!== parseInt(values.id));
              const resp     = {id:response.data.id,name:values.description,value:values.value};
 
              setData([resp,..._data]);
              setValues(initalValues);

              handleNotification("Um serviço foi atualizado",`O serviço ${values.description} foi Atulizado`);
               
              setLblButton("Cadastrar");

          } catch (err) {
              alert('Erro ao atulizar o serviço, tente novamente.');
          }
  }


  async function handleDelete(id) {

        var r = window.confirm("Tem certeza que deseja deletar?");
        
        if (!r)  return;

        try {
              await api.delete(`service/${id}`);
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
    <Header title={"Serviços"}/> 
    <section className="context">
            <div className="form"> 
    <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
      <div style={{marginBottom:"8px"}}>
        <TextField
          label="Descrição" 
          variant="outlined"
          name="description"
          value={values.description}
          onChange={handleChange}
        />
        <TextField
          id="outlined-error-helper-text"
          label="Valor" 
          variant="outlined"
          name="value"
          value={values.value}
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
      title={["Ação","Descrição","Valor"]}
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
