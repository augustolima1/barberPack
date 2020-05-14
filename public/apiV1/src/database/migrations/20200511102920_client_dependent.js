exports.up = function(knex) {
    return knex.schema.createTable('client_dependent', function (table) {
                table.increments();
                table.integer('client_id').notNullable();
                table.integer('dependente_id').notNullable(); 
                table.foreign('client_id').references('id').inTable('client'); 
                table.timestamp('created_at').defaultTo(knex.fn.now())
      });
};
 

exports.down = function(knex) {
    return  knex.schema.dropTable("client_dependent");
};
