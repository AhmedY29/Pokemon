<script lang="ts">
	import List from '$lib/components/List.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
</script>

<svelte:head>
	<title>Pokemon Explorer</title>
</svelte:head>

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
			<div class="flex h-full flex-col items-center justify-center">
				<img src="/Pokemon.png" alt="pokemon-select" width="200" class="grayscale-50" />
				<h1 class="text-lg font-bold">Select a Pokemon</h1>
				<h1 class="text-md">Choose a pokemon from the list to see details</h1>
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
