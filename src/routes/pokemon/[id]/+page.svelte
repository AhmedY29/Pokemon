<script lang="ts">
	import PokemonDetails from '$lib/components/PokemonDetails.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { goto } from '$app/navigation';

	let width = $state(0);
	let openDialog = $state(true);

	$effect(() => {
		if (!openDialog) {
			goto('/');
		}
	});
	let { data } = $props();

	let isMobile = $derived(() => width < 640);
</script>

<svelte:window bind:innerWidth={width} />

<PokemonDetails pokemonData={data.pokemonData} />

{#if isMobile()}
	<Dialog.Root bind:open={openDialog}>
		<Dialog.Content>
			<PokemonDetails pokemonData={data.pokemonData} />
		</Dialog.Content>
	</Dialog.Root>
{/if}
