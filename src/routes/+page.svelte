<script lang="ts">
	import { onMount } from 'svelte';

	const Base_Url = 'https://pokeapi.co/api/v2/';

	type Pokemon = {
		name: string;
		url: string;
	};

	type Types = {
		name: string;
		url: string;
	};

	type PokemonDetails = {
		forms: [
			{
				name: string;
				url: string;
			}
		];
		types: [
			{
				type: {
					name: string;
				};
			}
		];
	};

	let pokemonData: PokemonDetails[] = [];
	let types: Types[] = [];
	let next: string = '';
	let loading = false;
	const fetchPokemonData = async () => {
		try {
			loading = true;
			let res = await fetch(`${Base_Url}pokemon?limit=10&offset=0`);
			let data = await res.json();
			console.log(data, 'pokemon data from list api');
			next = data.next;
			// For Extract Pokemon Details -> Type
			let details = await Promise.all(
				data.results.map(async (pokemon: Pokemon) => {
					let res = await fetch(pokemon.url);
					return await res.json();
				})
			);
			pokemonData = details;
			console.log(pokemonData, 'pokemon data');
		} catch (error: any) {
			console.log(error.message, 'error');
		} finally {
			loading = false;
		}
	};

	const fetchTypeData = async () => {
		try {
			loading = true;
			let res = await fetch(`${Base_Url}type`);
			let data = await res.json();
			types = data.results;
			console.log(types, 'type');
		} catch (error: any) {
			console.log(error.message, 'type error');
		} finally {
			loading = false;
		}
	};

	onMount(() => {
		fetchPokemonData();
		fetchTypeData();
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
