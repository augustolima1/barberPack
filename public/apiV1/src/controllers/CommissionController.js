const moment = require('moment');
const path   = require('path');
const conn   = require(`${path.resolve(__dirname, '../database/conn')}`);

 
  number_format= function( number, decimals, dec_point, thousands_sep ) {
        var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
        var d = dec_point == undefined ? "," : dec_point;
        var t = thousands_sep == undefined ? "." : thousands_sep, s = n < 0 ? "-" : "";
        var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  }      


module.exports = {

    async index(request,response){ 

               const { date_ini,date_end } = request.query;
               


                const comission= await conn({a:"attendance_items"})
                        .leftJoin({b:'employee'},'b.id',       '=','a.employee_id')
                        .leftJoin({d:'services'},'d.id',       '=','a.service_id')
                        .leftJoin({e:'client'}  ,'e.id',       '=','a.client_id')
                        .leftJoin({f:'plans'}   ,'f.id',       '=','a.plan_id')
                        .select([
                            'b.name as employee',
                            conn.raw('sum(a.value)     as value'),
                            conn.raw('sum(a.rate)       as rate'),
                            conn.raw('sum(a.commission) as commission')
                            
                        ])
                        .groupBy('b.id')
                        .whereBetween('a.date',[date_ini,date_end])
                        .orderBy('b.name', 'desc')

                       
               
           var comissionObj = comission.map(function(row) {
                            return  {
                                      ...row,
                                       value:number_format(row.value,'.',','),
                                       rate:number_format(row.rate),
                                       commission:number_format(row.commission)

                                    }
           });
                                    

         return response.json(comissionObj);
    },

    async detailed(request,response){ 

        const { date_ini,date_end } = request.query;
        


         const comission= await conn({a:"attendance_items"})
                 .leftJoin({b:'employee'},'b.id',       '=','a.employee_id')
                 .leftJoin({d:'services'},'d.id',       '=','a.service_id')
                 .leftJoin({e:'client'}  ,'e.id',       '=','a.client_id')
                 .leftJoin({f:'plans'}   ,'f.id',       '=','a.plan_id')
                 .select([
                     'b.name as employee',
                     'e.name as client',
                     'd.description as service',
                     'f.description as plan',
                     'a.value',
                     'a.rate',
                     'a.commission',
                     'a.date'
                 ])
                 .whereBetween('a.date',[date_ini,date_end])
                 .orderBy('b.name', 'desc') 
 
        
    var comissionObj = comission.map(function(row) {
                     return  {
                               ...row,
                                date:moment(row.date).format('DD/MM/YYYY'),
                                value:number_format(row.value,'.',','),
                                rate:number_format(row.rate),
                                commission:number_format(row.commission)

                             }
    });
                             

  return response.json(comissionObj);
},
   
}