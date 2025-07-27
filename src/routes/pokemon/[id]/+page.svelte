<script lang="ts">
	import { page } from '$app/stores';
	import List from '$lib/components/List.svelte';
	import PokemonDetails from '$lib/components/PokemonDetails.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { goto } from '$app/navigation';

	let width = $state(0);
	let openDialog = $state(true);

	$effect(() => {
		if (!openDialog) {
			goto('/');
		}
	});
	let isMobile = $derived(() => width < 640);
</script>

<svelte:window bind:innerWidth={width} />

<div class="m-5 flex items-center justify-center">
	<Resizable.PaneGroup direction="horizontal" class=" min-h-[95vh] w-[90vw] rounded-lg border">
		<Resizable.Pane class={'hidden lg:block'}>
			<Sidebar />
		</Resizable.Pane>
		<Resizable.Handle />
		<Resizable.Pane>
			<List />
		</Resizable.Pane>
		<Resizable.Handle />
		<Resizable.Pane class={'hidden sm:block'}>
			<PokemonDetails />
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>

{#if isMobile()}
	<Dialog.Root bind:open={openDialog}>
		<!-- <Dialog.Trigger>Open</Dialog.Trigger> -->
		<Dialog.Content>
			<PokemonDetails />
		</Dialog.Content>
	</Dialog.Root>
{/if}
