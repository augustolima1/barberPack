
exports.up = function(knex) {
    return knex.schema.createTable('services', function (table) {
         table.increments();
         table.string('description').notNullable();
         table.decimal('value');
         table.timestamp('created_at').defaultTo(knex.fn.now())
         table.timestamp('updated_at').defaultTo(knex.fn.now())
       });
 };
 
 exports.down = function(knex) {
     return  knex.schema.dropTable("services");
 };
 