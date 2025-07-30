import { json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
	try {
		const { id } = params;
		const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
		const pokemonData = await res.json();
		return json(pokemonData);
	} catch (error: any) {
		return json({ message: 'Error in Get Pokemon Details' }, { status: 500 });
	}
};
