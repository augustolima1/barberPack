
exports.up = function(knex) {
    return knex.schema.createTable('plans', function (table) {
                table.increments();
                table.string('description').notNullable();
                table.decimal('value').notNullable();
                table.decimal('value_promotion');
                table.decimal('amount_promotion');
                table.timestamp('created_at').defaultTo(knex.fn.now())
                table.timestamp('updated_at').defaultTo(knex.fn.now())
      });
};

exports.down = function(knex) {
    return  knex.schema.dropTable("plans");
};
