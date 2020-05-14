exports.up = function(knex) {
    return knex.schema.createTable('attendance', function (table) {
                table.increments();
                table.integer('client_id').notNullable();
                table.date('date').notNullable();                                
                table.foreign('client_id').references('id').inTable('client');
                table.timestamp('created_at').defaultTo(knex.fn.now())
      });
};

 

exports.down = function(knex) {
    return  knex.schema.dropTable("attendance");
};

