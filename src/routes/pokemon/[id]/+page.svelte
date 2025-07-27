<script lang="ts">
	import { page } from '$app/stores';
	import List from '$lib/components/List.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	let { id } = $page.params;
</script>

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
			Pokemon {id}
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
