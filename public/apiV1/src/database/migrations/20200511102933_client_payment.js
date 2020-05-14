exports.up = function(knex) {
    return knex.schema.createTable('client_payment', function (table) {
                table.increments();
                table.integer('client_id').notNullable();
                table.integer('year').notNullable(); 
                table.integer('january'); 
                table.integer('january_form_payment_id');
                table.integer('february'); 
                table.integer('february_form_payment_id');
                table.integer('march'); 
                table.integer('march_form_payment_id');
                table.integer('April'); 
                table.integer('April_form_payment_id');
                table.integer('may'); 
                table.integer('may_form_payment_id');
                table.integer('june'); 
                table.integer('june_form_payment_id');
                table.integer('july'); 
                table.integer('july_form_payment_id');
                table.integer('august'); 
                table.integer('august_form_payment_id');
                table.integer('september'); 
                table.integer('september_form_payment_id');
                table.integer('october'); 
                table.integer('october_form_payment_id');
                table.integer('november'); 
                table.integer('november_form_payment_id');
                table.integer('december');   
                table.integer('december_form_payment_id'); 

                table.foreign('client_id').references('id').inTable('client'); 
                table.timestamp('created_at').defaultTo(knex.fn.now())
      });
};
 

exports.down = function(knex) {
    return  knex.schema.dropTable("client_payment");
};
