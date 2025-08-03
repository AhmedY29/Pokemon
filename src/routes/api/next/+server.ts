import { db } from '$lib/contactDB';
import { pokemonListDB } from '$lib/schema';
import { loadMoreLoading, nextUrl } from '$lib/stores/store.js';
import { supabase } from '$lib/supabaseClient';
import type { Pokemon } from '$lib/types';
import { json } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { and, gte, lte } from 'drizzle-orm';
import { uploadImageFromUrl } from '$lib/updloadImage';

export const GET = async () => {
	loadMoreLoading.set(true);
	const next = get(nextUrl).split('?')[1].split('&')[0].split('=')[1];
	try {
		// const { data } = await supabase
		// 	.from('PokemonList')
		// 	.select('*')
		// 	.gte('pokemonId', Number(+next + 1))
		// 	.lte('pokemonId', Number(+next + +next));

		const data = await db
			.select()
			.from(pokemonListDB)
			.where(
				and(
					gte(pokemonListDB.pokemonId, Number(+next + 1)),
					lte(pokemonListDB.pokemonId, Number(+next + +next))
				)
			);

		if (data?.length > 9) {
			nextUrl.set(`https://pokeapi.co/api/v2/pokemon/?offset=${Number(+next + +next)}&limit=10`);
			return json({
				pokemonList: data
			});
		}
		const res = await fetch(`${get(nextUrl)}`);

		if (!res.ok) {
			throw new Error(`API request failed with status ${res.status}`);
		}

		const reaData = await res.json();
		nextUrl.set(reaData.next);
		let pokemonDetails = await Promise.all(
			reaData.results.map(async (pokemon: Pokemon) => {
				let res = await fetch(pokemon.url);
				return await res.json();
			})
		);

		const pokemonList = await Promise.all(
			pokemonDetails.map(async (e: any) => ({
				pokemonName: e.name,
				pokemonId: e.id,
				pokemonImg: await uploadImageFromUrl(e.sprites.front_default),
				abilities: e.abilities.map((a: any) => ({ name: a.ability?.name })),
				stats: e.stats.map((a: any) => ({
					base_stat: a.base_stat,
					stat: { name: a.stat.name }
				})),
				types: e.types[0]?.type.name
			}))
		);

		// const { error } = await supabase.from('PokemonList').insert(pokemonList);
		await db
			.insert(pokemonListDB)
			.values(pokemonList)
			.onConflictDoNothing({ target: pokemonListDB.pokemonId });

		// if (error) {
		// 	console.log(error, 'error in next insert');
		// }
		return json({
			pokemonList
		});
	} catch (error) {
		console.error('Error fetching pokemon data:', error);
		return json({ message: 'Failed to fetch pokemon data' }, { status: 500 });
	} finally {
		loadMoreLoading.set(false);
	}
};
