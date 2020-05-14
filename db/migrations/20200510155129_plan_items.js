
exports.up = function(knex) {
    return knex.schema.createTable('plan_items', function (table) {
                table.increments();
                table.integer('amount').notNullable();
                table.integer('plan_id').notNullable();
                table.integer('service_id').notNullable();
                table.foreign('plan_id').references('id').inTable('plans');
                table.foreign('service_id').references('id').inTable('services');
                table.timestamp('created_at').defaultTo(knex.fn.now())
                table.timestamp('updated_at').defaultTo(knex.fn.now())
      });
};

exports.down = function(knex) {
    return  knex.schema.dropTable("plan_items");
};
