import React,{useState,useEffect}    from 'react';
import {useParams }                  from "react-router-dom";
import {TextField,Button }  from '@material-ui/core';
import { makeStyles }                from '@material-ui/core/styles';
import SaveIcon                      from '@material-ui/icons/Save';
import ArrowBackIcon                 from '@material-ui/icons/ArrowBack';
import IconButton                    from '@material-ui/core/IconButton';
import DeleteIcon                    from '@material-ui/icons/Delete';
import Autocomplete                  from '@material-ui/lab/Autocomplete';
import Header                        from '~/components/Header';
import CustomPaginationActionsTable  from '~/components/tables';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

//import MomentUtils from '@date-io/moment';
import ptBrLocale from "date-fns/locale/pt-BR";
import DateFnsUtils from '@date-io/date-fns';

import * as moment from 'moment';

import  api           from '~/services/api';
import  history       from '~/services/history';
 
const { ipcRenderer } = window.require("electron");


const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root +.MuiTextField-root,.MuiButton-root,.MuiAutocomplete-root +.MuiAutocomplete-root': {
      marginLeft: theme.spacing(1),
    }
  },
  
}));



export default function AttendanceItem() {
  const classes           = useStyles();
  const initalValues={
            id:null,
            attendance_number:'',
            client_id:'',
            client_text:'',
            date:moment().format(),
            service_id  :'',
            service_text:'',
            employee_id:''
  }

  const [values,           setValues]            = useState(initalValues);
  const [disabled,         setDisabled]          = useState(false);
  const [disabledService,  setDisabledService]   = useState(true);
  const [data,             setData]              = useState([]); 
  const [client,           setClient]            = useState([]);
  const [employee,         setEmployee]          = useState([]);
  const [services,         setService]           = useState([]); 
  const [servicesClear,    setServiceClear]      = useState(''); 
  
  const { attendance_id } = useParams();
 
 
  useEffect(() => {

 
      api.get('employee').then(response => {
          setEmployee(response.data);
      }) 
      
      if(attendance_id)
          api.get(`attendance/items/${attendance_id}`).then(response => {
                  setData(response.data.attendance_items);
                  servicesClient(response.data.attendance.client_id);
                  setValues({
                    ...values,
                    ...response.data.attendance,
                    date:moment(response.data.attendance.date).format(),
                    client_text:`${response.data.attendance.name} - ${response.data.attendance.phone}`,
                    attendance_number:` N° ${response.data.attendance.id.toString().padStart(4, "0")}`,
                  }); 

                  setDisabled(true);
          }) 

       else
          api.get('attendance/client').then(response => {
              setClient(response.data);
          })

  }, []);
 

   const handleDateChange = (date) => {
       
        let _date=moment(date).format('YYYY-MM-DD')

        getServicesClient(values.client_id,_date);

         setValues({...values,date:date})
  };


  const handleNotification=(title,body)=>{
      const message = {
          title: title,
          body: body
      };

      ipcRenderer.send("@notification/REQUEST", message);
  }



 
  async function getServicesClient(client_id,data) {
     await api.get(`attendance/services/${client_id}/${data}`).then(response => {
            setService(response.data);
            setDisabledService(false);
      })
  }

  async function servicesClient(client_id) {
          let date=moment(values.date).format('YYYY-MM-DD')

          await  getServicesClient(client_id,date);
        
        /*await api.get(`attendance/services/${client_id}`).then(response => {
                  setService(response.data);
                  setDisabledService(false);
        })*/
  } 

  async function handleChangeClient(clientValue) {
           setValues({
              ...values,
              ...clientValue
            })
          
            servicesClient(clientValue.client_id);
  }
   
  async function handleSubmit(e) {
          e.preventDefault(); 

          try {
              
            values.date=moment(values.date).format('YYYY-MM-DD'); 
           
        
            const response= await api.post('attendance',values).
                                 catch(err=> alert(`Atenção, ${err.response.data.error}`) );
            
            setValues({
                  ...values,
                  id:response.data.id,
                  attendance_number:` N° ${response.data.id.toString().padStart(4, "0")}`,
                  service_id:'',
                  service_text:'',
                  date:moment(values.date).format()
            });

            setDisabled(true);
            setData(response.data.attendance);
            servicesClient(values.client_id);
            handleNotification("Um novo registro foi cadastrado",'Registro Cadastrado com sucesso!');

          }catch (err) {
              
          }
  }
   
 

  async function handleDelete(id) {

        var r = window.confirm("Tem certeza que deseja deletar?");
        
        if (!r)  return;

        try {
              await api.delete(`attendance/item/${id}`);
              
              setData(data.filter(ret => ret.id !== parseInt(id) ));
              handleNotification("Atenção","Registro excluído com sucesso");
            }catch (err) {
              alert('Erro ao deletar o serviço, tente novamente.');
            }
  
  }

 
 
  return (
    <>
    <Header title={`Itens do Atendimento ${values.attendance_number}`}/> 
    <section className="context">
            <div className="form"> 
    <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
      <div style={{marginBottom:"8px"}}>
       
      {values.client_text &&
          <TextField  
          style={{width:"708px",display:"inline-flex"}}
          label="Cliente"
          margin="normal" 
          variant="outlined"
          disabled={disabled}
          value={values.client_text}
          />
      }
      {!values.client_text &&
      <Autocomplete
         
        disabled={disabled}
        style={{width:"708px",display:"inline-flex"}}
        id="cliente"
        freeSolo
        onChange={(event, newValue) => {
          if(newValue)
             handleChangeClient({
                         client_id:newValue.id
                        })
        }}
        
        className={'MuiTextField-root'}
        options={client}
        getOptionLabel={(option) => `${option.name} - ${option.phone}`} 
        renderInput={(params) => (
          <TextField  {...params} label="Cliente" margin="normal" variant="outlined" />
        )}
      />
        }

      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBrLocale}>
       
        <KeyboardDatePicker
          disabled={disabled}
          style={{width:"323px"}}
          disableToolbar
          variant="outlined"
          inputVariant="outlined"
          id="date-picker-dialog"
          format="dd/MM/yyyy"
          margin="normal"          
          label="Data"
          value={values.date}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date'
          }}
        />
         
    </MuiPickersUtilsProvider>
 
      </div>
      <h3>Itens do Atendimento</h3>
      <div style={{marginBottom:"8px"}}>

      {/*inputValue={values.service_text*/}
      <Autocomplete
        disabled={disabledService}
        id="services"
        style={{width:"350px",display:"inline-flex"}}
        freeSolo
        onChange={(event, newValue) => {
          if(newValue)
             setValues({
                        ...values,
                        service_id:newValue.id,
                        service_text:newValue.description
                    })
        }}
        options={services}
        getOptionLabel={(option) => `${option.description}`} 
        renderInput={(params) => (
          <TextField {...params} label="Serviços" margin="normal" variant="outlined" />
        )}
      />
 

    <Autocomplete
        id="profissional"
        style={{width:"350px",display:"inline-flex"}}
        freeSolo
        onChange={(event, newValue) => {
          if(newValue)
            setValues({...values,employee_id:newValue.id})   
        }}
        options={employee}         
        getOptionLabel={(option) => `${option.name}`} 
        renderInput={(params) => (
          <TextField {...params} label="Profissional" margin="normal" variant="outlined" />
        )}
      /> 
      
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<SaveIcon />}
        type="submit"
       >
        Adicionar
      </Button>

      <Button
        variant="contained"
        color="secondary"
        size="large"
        startIcon={<ArrowBackIcon/>}
        onClick={()=>history.push('/attendance')}
       >
        Concluir
      </Button>       
      </div>
    </form>

    <CustomPaginationActionsTable 
      data={data} 
      title={["Ação","Serviço","Profissional","data"]}
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
