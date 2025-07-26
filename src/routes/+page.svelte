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

	const capitalizeNames = (name: string) => {
		return `${name[0].toUpperCase()}${name.slice(1)}`;
	};
	const extractId = (url: string) => {
		return url.split('/')[6];
	};

	onMount(() => {
		fetchPokemonData();
		fetchTypeData();
	});
</script>

<!-- <h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p> -->

<div>
	<select name="" id="">
		<option value="">Select Type</option>
		{#each types as type}
			<option value={type.url}>{capitalizeNames(type.name)}</option>
		{/each}
	</select>
	<div class="cards flex flex-col gap-5 overflow-auto">
		{#if loading}
			<div><h1>Loading</h1></div>
		{:else}
			{#each pokemonData as pokemon}
				<div
					class="flex items-end justify-between border bg-zinc-100 p-3 transition-all duration-200 hover:bg-zinc-200"
				>
					<div class="title">
						<h1>
							{capitalizeNames(pokemon.forms[0].name)}
						</h1>
						<div class="flex gap-2">
							<h1>
								#{extractId(pokemon.forms[0].url)}
							</h1>
							<h1
								class={`${pokemon.types[0].type.name == 'grass' ? 'bg-green-200/20' : pokemon.types[0].type.name == 'fire' ? 'bg-red-200/20' : pokemon.types[0].type.name == 'water' ? 'bg-blue-200/20' : 'bg-yellow-200/20'} rounded-2xl px-2`}
							>
								{capitalizeNames(pokemon.types[0].type.name)}
							</h1>
						</div>
					</div>
					<div class="type">
						<h1
							class={`${pokemon.types[0].type.name == 'grass' ? 'bg-green-200' : pokemon.types[0].type.name == 'fire' ? 'bg-red-200' : pokemon.types[0].type.name == 'water' ? 'bg-blue-200' : 'bg-yellow-200'} rounded-2xl px-2`}
						>
							{capitalizeNames(pokemon.types[0].type.name)}
						</h1>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
