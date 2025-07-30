import { nextUrl, pokemonList } from '$lib/stores/store';
import type { Pokemon } from '$lib/types';
import { json } from '@sveltejs/kit';

export const GET = async () => {
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
		return json({
			pokemonList: pokemonDetails,
			types: typeData.results
		});
	} catch (error: any) {
		console.log(error.message);
		return json({ message: 'Error in Get List', error: error.message });
	}
	// return new Response();
};
