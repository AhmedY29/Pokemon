import { integer, pgTable, serial, text, jsonb } from 'drizzle-orm/pg-core';

export const pokemonListDB = pgTable('PokemonList', {
	id: serial('id').primaryKey(),
	pokemonName: text('pokemonName'),
	pokemonId: integer('pokemonId').unique(),
	pokemonImg: text('pokemonImg'),
	types: text('types'),
	abilities: jsonb('abilities').$type<{ name: string }[]>().notNull().default([]),
	stats: jsonb('stats')
		.$type<
			{
				base_stat: number;
				stat: { name: string };
			}[]
		>()
		.notNull()
		.default([])
});

export const typesDB = pgTable('types', {
	id: serial('id').primaryKey(),
	name: text('name')
});
