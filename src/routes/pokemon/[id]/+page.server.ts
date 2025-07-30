import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { id } = params;
	const res = await fetch(`/api/pokemon/${id}`);
	const pokemonData = await res.json();

	return { pokemonData: pokemonData };
};
