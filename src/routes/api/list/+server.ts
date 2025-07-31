import { loading, nextUrl, pokemonList } from '$lib/stores/store';
import type { Pokemon, Types } from '$lib/types';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	loading.set(true);
	try {
		const [pokemonRes, typeRes] = await Promise.all([
			fetch('https://pokeapi.co/api/v2/pokemon?limit=10&offset=0'),
			fetch('https://pokeapi.co/api/v2/type')
		]);

		const [pokemonData, typeData] = await Promise.all([pokemonRes.json(), typeRes.json()]);
		// const next = pokemonData.next;
		nextUrl.set(pokemonData.next);

		let pokemonDetails = await Promise.all(
			// TODO: import type -> Pokemon
			pokemonData.results.map(async (pokemon: Pokemon) => {
				let res = await fetch(pokemon.url);
				return await res.json();
			})
		);
		const pokemonList = pokemonDetails.map((e: any) => ({
			pokemonName: e.name,
			pokemonId: e.id,
			types: e.types[0]?.type.name
		}));

		return json({
			pokemonList,
			types: typeData.results.map((type: Types) => ({ name: type.name }))
		});
	} catch (error: any) {
		console.log(error.message);
		return json({ message: 'Error in Get List', error: error.message });
	} finally {
		loading.set(false);
	}
	// return new Response();
};
