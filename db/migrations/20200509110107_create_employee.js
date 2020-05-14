
exports.up = function(knex) {
    return knex.schema.createTable('employee', function (table) {
        table.increments();
        table.string('name').notNullable();
        table.string('phone').notNullable();
        table.decimal('commission').notNullable();
        table.decimal('rate_card');
        
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
      });
};

exports.down = function(knex) {
    return  knex.schema.dropTable("employee");
};
