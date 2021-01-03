
exports.up = function(knex) {
    return knex.schema.createTable('users', tbl => {
        tbl.increments();
        tbl.string('email', 255)
            .notNullable()
            .unique(); 
        tbl.string('username', 255)
            .notNullable()
            .unique(); 
        tbl.string('password', 255)
            .notNullable();
        tbl.string('fullName', 255)
            .notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};