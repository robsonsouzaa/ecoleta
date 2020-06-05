import Knex from 'knex';

export async function up(knex: Knex) {

  return knex.schema.createTable('ponto_itens', table => {
    table.increments('id').primary();
    table.integer('ponto_id')
      .notNullable()
      .references('id')
      .inTable('pontos');

    table.integer('item_id')
      .notNullable()
      .references('id')
      .inTable('itens');
  });
}

export async function down(knex: Knex) {

  return knex.schema.dropTable('ponto_itens');
}