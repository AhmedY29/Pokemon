import type { PokemonDetails } from '$lib/types';
import { json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
	try {
		const { id } = params;
		const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
		const data = await res.json();

		const pokemonData = {
			abilities: data.abilities.map((e: any) => ({ name: e.ability?.name })),
			pokemonName: data?.forms[0]?.name,
			stats: data.stats.map((e: any) => ({
				base_stat: e.base_stat,
				stat: { name: e.stat.name }
			})),
			pokemonImg: data.sprites.front_default
		};
		return json(pokemonData);
	} catch (error: any) {
		return json({ message: 'Error in Get Pokemon Details' }, { status: 500 });
	}
};
