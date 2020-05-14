exports.up = function(knex) {
    return knex.schema.createTable('attendance_items', function (table) {
                table.increments();
                table.integer('attendance_id').notNullable();
                table.integer('service_id').notNullable(); 
                table.integer('employee_id').notNullable();
                table.integer('client_id').notNullable();
                table.integer('plan_id').notNullable();

                table.decimal('value').notNullable();
                table.decimal('rate').notNullable();
                table.decimal('commission').notNullable();

                table.date('date').notNullable(); 

                table.integer('user_id');
                
                table.foreign('attendance_id').references('id').inTable('attendance');
                table.foreign('service_id').references('id').inTable('services');
                table.foreign('employee_id').references('id').inTable('employee');
                table.foreign('client_id').references('id').inTable('client');
                table.foreign('plan_id').references('id').inTable('plans');
                table.foreign('user_id').references('id').inTable('users');

                table.timestamp('created_at').defaultTo(knex.fn.now())
      });
};

 

exports.down = function(knex) {
    return  knex.schema.dropTable("attendance_items");
};
