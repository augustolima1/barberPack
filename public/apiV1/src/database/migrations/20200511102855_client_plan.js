exports.up = function(knex) {
    return knex.schema.createTable('client_plan', function (table) {
                table.increments();
                table.integer('client_id').notNullable();
                table.integer('plan_id').notNullable();
                table.integer('expiration_day',2);
                table.decimal('value');
                table.decimal('value_promotion');
                table.string('expiration_promotion');
                table.string('active',2);
                table.string('user_id');

                table.foreign('client_id').references('id').inTable('client');
                table.foreign('plan_id').references('id').inTable('plans');
                
                table.timestamp('created_at').defaultTo(knex.fn.now())
                table.timestamp('updated_at').defaultTo(knex.fn.now())
      });
};
 

exports.down = function(knex) {
    return  knex.schema.dropTable("client_plan");
};
