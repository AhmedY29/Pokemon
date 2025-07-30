<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import List from '$lib/components/List.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import { pokemonList, pokemonTypes } from '$lib/stores/store';
	let { children, data } = $props();
	let { id } = $state($page.params);
	const unsubscribe = page.subscribe(($page) => {
		id = $page.params.id;
	});

	onDestroy(() => {
		unsubscribe();
	});

	pokemonList.set(data.pokemonList);
	pokemonTypes.set(data.types);

	const handleRetry = async () => {
		try {
			const res = await fetch('api/list');
			const resData = await res.json();
			pokemonList.set(resData.pokemonList);
		} catch (error) {
			console.log('error in retry');
		}
	};

	const handleLoadMore = async () => {
		try {
			const res = await fetch('/api/next');
			const resData = await res.json();
			pokemonList.update((prev: any) => [...prev, ...resData.pokemonList]);
		} catch (error: any) {
			console.log('error in Load More', error.message);
		}
	};
</script>

<ModeWatcher />
<div class="m-5 mb-0 flex items-center justify-center">
	<Resizable.PaneGroup direction="horizontal" class=" min-h-[95vh] w-[90vw] rounded-lg border">
		<Resizable.Pane class={'hidden lg:block'}>
			<Sidebar />
		</Resizable.Pane>
		<Resizable.Handle />
		<Resizable.Pane>
			<List pokemonList={$pokemonList} types={$pokemonTypes} {handleRetry} {handleLoadMore} />
		</Resizable.Pane>
		<Resizable.Handle />
		<Resizable.Pane class={'hidden sm:block'}>
			{#if id}
				{@render children()}
			{:else}
				<div class="flex h-full flex-col items-center justify-center">
					<img src="/Pokemon.png" alt="pokemon-select" width="200" class="grayscale-50" />
					<h1 class="text-lg font-bold">Select a Pokemon</h1>
					<h1 class="text-md">Choose a pokemon from the list to see details</h1>
				</div>
			{/if}
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
