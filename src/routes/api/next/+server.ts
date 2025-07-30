import { nextUrl } from '$lib/stores/store.js';
import type { Pokemon } from '$lib/types';
import { json } from '@sveltejs/kit';
import { get } from 'svelte/store';

export const GET = async () => {
	try {
		const res = await fetch(`${get(nextUrl)}`);

		if (!res.ok) {
			throw new Error(`API request failed with status ${res.status}`);
		}

		const data = await res.json();
		nextUrl.set(data.next);
		let pokemonDetails = await Promise.all(
			data.results.map(async (pokemon: Pokemon) => {
				let res = await fetch(pokemon.url);
				return await res.json();
			})
		);

		return json({
			pokemonList: pokemonDetails
		});
	} catch (error) {
		console.error('Error fetching pokemon data:', error);
		return json({ message: 'Failed to fetch pokemon data' }, { status: 500 });
	}
};
