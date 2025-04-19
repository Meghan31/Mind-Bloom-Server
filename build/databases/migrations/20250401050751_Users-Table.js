/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable('users', function (table) {
		table.increments('id').primary();
		table.string('username').notNullable(); // Removed unique constraint
		table.string('email').notNullable().unique(); // Only email is unique
		table.string('password_hash').notNullable();
		table.timestamps(true, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable('users');
};
