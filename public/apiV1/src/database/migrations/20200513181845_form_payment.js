exports.up = function(knex) {
    return knex.schema.createTable('form_payment', function (table) {
                table.increments();
                table.string('description').notNullable();
                table.decimal('rate').notNullable();           
                table.timestamp('created_at').defaultTo(knex.fn.now())
      });
};

 

exports.down = function(knex) {
    return  knex.schema.dropTable("form_payment");
};

