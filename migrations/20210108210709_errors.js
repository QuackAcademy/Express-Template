
exports.up = function(knex) {
    return knex.schema.createTable('errors', tbl => {
        tbl.increments()

        tbl.integer('user_id', 255)
        .references("id").inTable("users")
        .onDelete('SET NULL')
        
        tbl.timestamp("errorDate")
        .defaultTo(knex.fn.now())
        .notNullable();

        tbl.varchar("errorID", 1000).notNullable()
        tbl.varchar("errorMessage", 10000).notNullable()
        tbl.varchar("endpoint", 255)
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('errors')
};