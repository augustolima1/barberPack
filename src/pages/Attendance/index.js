import React,{useState,useEffect}    from 'react';
import  Button                       from '@material-ui/core/Button';
import { makeStyles }                from '@material-ui/core/styles';
import IconButton                    from '@material-ui/core/IconButton';
import DeleteIcon                    from '@material-ui/icons/Delete';
import PageviewIcon                  from '@material-ui/icons/Pageview';
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



export default function Attendance() {
  const classes           = useStyles();
  const initalValues={
      id:null, 
      description:'',
      amount:'', 
      services_id:1
  }
  const [values, setValues] = useState(initalValues);
  const [data, setData]     = useState([]);

  const [lblButton, setLblButton] = useState('Cadastrar');

  useEffect(() => {
    api.get('attendance').then(response => {
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


 
 
  async function handleDelete(id) {

        var r = window.confirm("Tem certeza que deseja deletar?");
        
        if (!r)  return;

        try {
              await api.delete(`attendance/${id}`);
              setValues(initalValues);
              setData(data.filter(_data =>_data.id!== parseInt(id)));              
              handleNotification("Atenção","Registro excluído com sucesso");
          } catch (err) {
              alert('Erro ao deletar o serviço, tente novamente.');
          }
  
  }

   


    
  return (
    <>
    <Header title={"Atendimentos"}/> 
    <section className="context">
            <div className="form"> 
    <form className={classes.root} noValidate autoComplete="off">
      <div style={{marginBottom:"8px"}}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={()=>history.push('/attendance/items')}
       >
        Novo
        </Button>

      </div>
    </form>
    <CustomPaginationActionsTable 
      data={data} 
      title={["Ação","Cliente","Data"]}
      actionBody={
            <>
            <IconButton 
                style={{padding:"0 8px"}} 
                color="primary" 
                onClick={(e)=>history.push(`/attendance/items/${e.target.closest('tr').getAttribute('data-id')}`)}>
                <PageviewIcon />
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
