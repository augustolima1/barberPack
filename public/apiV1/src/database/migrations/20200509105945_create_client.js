
exports.up = function(knex) {
    return knex.schema.createTable('client', function (table) {
        table.increments();
        table.string('name').notNullable();
        table.string('phone').notNullable();
        table.string('active',2).notNullable();        
        
        table.integer('form_payment_id');
        table.foreign('form_payment_id').references('id').inTable('payment_id');

        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
      });
};

exports.down = function(knex) {
    return  knex.schema.dropTable("client");
};
