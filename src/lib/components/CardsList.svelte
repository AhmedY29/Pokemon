<script>
	import Card from './Card.svelte';
	let { filteredPokemonData, capitalizeNames } = $props();
</script>

{#each filteredPokemonData as pokemon}
	<a href={`/pokemon/${pokemon.pokemonId}`}>
		<Card
			pokemonName={capitalizeNames(pokemon.pokemonName)}
			pokemonId={pokemon.pokemonId}
			pokemonType={capitalizeNames(pokemon.types)}
		/>
	</a>
{/each}
