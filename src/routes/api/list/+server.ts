import { db } from '$lib/contactDB';
import { pokemonListDB, typesDB } from '$lib/schema';
import { loading, nextUrl, pokemonList } from '$lib/stores/store';
import { supabase } from '$lib/supabaseClient';
import type { Pokemon, Types } from '$lib/types';
import { uploadImageFromUrl } from '$lib/updloadImage';
import { json } from '@sveltejs/kit';
import { asc } from 'drizzle-orm';

export const GET = async () => {
	loading.set(true);
	try {
		// const { data } = await supabase
		// 	.from('PokemonList')
		// 	.select('*')
		// 	.gte('pokemonId', 1)
		// 	.lte('pokemonId', 10);

		let data: any = await db
			.select()
			.from(pokemonListDB)
			.orderBy(asc(pokemonListDB.pokemonId))
			.limit(10);

		let typeDataDB = await db.select().from(typesDB);

		if (typeDataDB.length == 0) {
			const resT = await fetch('https://pokeapi.co/api/v2/type');
			const dataT = await resT.json();
			typeDataDB = dataT.results.map((type: Types) => ({ name: type.name }));

			await db.insert(typesDB).values(typeDataDB);
		}

		if (data.length < 10) {
			const resPoke = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10&offset=0');
			const dataPoke = await resPoke.json();
			let pokemonDetails = await Promise.all(
				dataPoke.results.map(async (pokemon: Pokemon) => {
					let res = await fetch(pokemon.url);
					return await res.json();
				})
			);
			const pokemonList = await Promise.all(
				pokemonDetails.map(async (e: any) => ({
					pokemonName: e.name,
					pokemonId: Number(e.id),
					pokemonImg: await uploadImageFromUrl(e.sprites.front_default),
					abilities: e.abilities.map((a: any) => ({ name: a.ability?.name })),
					stats: e.stats.map((a: any) => ({
						base_stat: a.base_stat,
						stat: { name: a.stat.name }
					})),
					types: e.types[0]?.type.name
				}))
			);
			data = pokemonList;
			await db
				.insert(pokemonListDB)
				.values(data)
				.onConflictDoNothing({ target: pokemonListDB.pokemonId });
		}

		nextUrl.set(`https://pokeapi.co/api/v2/pokemon/?offset=10&limit=10`);
		return json({
			pokemonList: data,
			types: typeDataDB
		});
	} catch (error: any) {
		console.log(error);
		return json({ message: 'Error in Get List', error: error.message });
	} finally {
		loading.set(false);
	}
	// return new Response();
};
