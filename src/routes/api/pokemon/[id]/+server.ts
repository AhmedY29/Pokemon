import { db } from '$lib/contactDB.js';
import { pokemonListDB } from '$lib/schema.js';
import type { PokemonDetails } from '$lib/types';
import { uploadImageFromUrl } from '$lib/updloadImage.js';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET = async ({ params }) => {
	try {
		const { id } = params;

		const supaData = await db
			.select()
			.from(pokemonListDB)
			.where(eq(pokemonListDB.pokemonId, Number(id)));

		if (supaData.length > 0) {
			return json(supaData[0]);
		}
		const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
		const data = await res.json();

		const pokemonData = {
			abilities: data.abilities.map((e: any) => ({ name: e.ability?.name })),
			pokemonName: data?.forms[0]?.name,
			stats: data.stats.map((e: any) => ({
				base_stat: e.base_stat,
				stat: { name: e.stat.name }
			})),
			pokemonId: Number(id),
			pokemonImg: await uploadImageFromUrl(data.sprites.front_default),
			types: data.types[0]?.type.name
		};
		await db.insert(pokemonListDB).values(pokemonData);

		return json(pokemonData);
	} catch (error: any) {
		return json({ message: `Error in Get Pokemon Details: ${error.message}` }, { status: 500 });
	}
};
