<script lang="ts">
	import List from '$lib/components/List.svelte';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
</script>

<div class="m-5 flex items-center justify-center">
	<Resizable.PaneGroup direction="horizontal" class=" min-h-[95vh] w-[90vw] rounded-lg border">
		<Resizable.Pane class={'hidden lg:block'}>Explore</Resizable.Pane>
		<Resizable.Handle />
		<Resizable.Pane>
			<List />
		</Resizable.Pane>
		<Resizable.Handle />
		<Resizable.Pane class={'hidden sm:block'}>Details</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
