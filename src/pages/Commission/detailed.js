import React,{useState,useEffect}    from 'react';
import  Button                       from '@material-ui/core/Button';
import { makeStyles }                from '@material-ui/core/styles';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
 
import ptBrLocale   from "date-fns/locale/pt-BR";
import DateFnsUtils from '@date-io/date-fns';

import * as moment  from 'moment';

import Header                        from '~/components/Header';
import CustomPaginationActionsTable  from '~/components/tables';



import  api           from '~/services/api';
import  history       from '~/services/history';
 
const { ipcRenderer } = window.require("electron");


const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root +.MuiTextField-root,.MuiButton-root,.MuiAutocomplete-root +.MuiAutocomplete-root': {
      marginLeft: theme.spacing(1),
    },
    '& .MuiFormControl-marginNormal':{
       marginTop:0
    }
    
  },
  
}));


export default function Commission() {
  const classes           = useStyles();

  const initalValues={
          date_ini:moment().startOf('month').format(),
          date_end:moment().endOf('month').format()
  }

  const [values, setValues] = useState(initalValues);
  const [data, setData]     = useState([]);
 


  

  async function loadCommission(_values) {
    let date_ini=moment(_values.date_ini).format('YYYY-MM-DD'); 
    let date_end=moment(_values.date_end).format('YYYY-MM-DD'); 

    const response = await api.get('commission/detailed',{
      params:{date_ini,date_end}
    });

    setData(response.data)

  }

  useEffect(() => {
    loadCommission(values);
  }, []);
  

  const handleDateIniChange = (date) => {
        setValues({...values,date_ini:date})

        loadCommission({...values,date_ini:date});
   };

   
  const handleDateEndChange = (date) => {
        setValues({...values,date_end:date})
        loadCommission({...values,date_end:date});
 };
   


    
  return (
    <>
    <Header title={"Relatório de Comissão - Detalhado"}/> 
    <section className="context">
            <div className="form"> 
    <form className={classes.root} noValidate autoComplete="off">
      <div style={{marginBottom:"8px"}}>

      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBrLocale}>
       
        <KeyboardDatePicker
          style={{width:"323px"}}
          disableToolbar
          variant="outlined"
          inputVariant="outlined"
          id="date-picker-dialog"
          format="dd/MM/yyyy"
          margin="normal"          
          label="Data Inicial"
          value={values.date_ini}
          onChange={handleDateIniChange}
          KeyboardButtonProps={{
            'aria-label': 'change date'
          }}
        />

        <KeyboardDatePicker
          
          style={{width:"323px"}}
          disableToolbar
          variant="outlined"
          inputVariant="outlined"
          id="date-picker-dialog"
          format="dd/MM/yyyy"
          margin="normal"          
          label="Data Final"
          value={values.date_end}
          onChange={handleDateEndChange}
          KeyboardButtonProps={{
            'aria-label': 'change date'
          }}
        />     
    </MuiPickersUtilsProvider>


      <Button
      
        variant="contained"
        color="secondary"
        size="large"
        onClick={()=>history.push('/rel/commission')}
       >
        Voltar
        </Button>

      </div>
    </form>
    <CustomPaginationActionsTable 
      data={data} 
      title={["Colaborador","Cliente","Serviço","Plano","Valor","Taxa Cartão","R$ Comissão","Data"]}
      />
      </div>
      </section>
    </>
  );
}
