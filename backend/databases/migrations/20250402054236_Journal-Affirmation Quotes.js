/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema
		.createTable('affirmations', function (table) {
			table.increments('id').primary();
			table.text('content').notNullable();
			table.string('mood_type').notNullable(); // Will store the mood name (Happy, Sad, etc.)
			table.timestamps(true, true);
		})
		.createTable('journal_entries', function (table) {
			table.increments('id').primary();
			table.integer('user_id').notNullable().references('id').inTable('users');
			table.text('content').notNullable();
			table.string('mood').notNullable(); // Store the actual mood name instead of rating
			table.integer('affirmation_id').references('id').inTable('affirmations');
			table.date('entry_date').notNullable().defaultTo(knex.fn.now());
			table.timestamps(true, true);

			// Add index for faster queries by user_id and entry_date
			table.index(['user_id', 'entry_date']);
		});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable('journal_entries').dropTable('affirmations');
};
