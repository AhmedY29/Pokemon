<script lang="ts">
	export let pokemonId;
	export let pokemonName;
	export let pokemonType;
</script>

<div
	class="flex items-end justify-between rounded border bg-zinc-100 p-3 transition-all duration-200 hover:bg-zinc-200"
>
	<div class="title">
		<h1>
			{pokemonName}
		</h1>
		<div class="flex gap-2">
			<h1>
				#{pokemonId}
			</h1>
			<h1
				class={`${pokemonType.toLowerCase() == 'grass' ? 'bg-green-200/20' : pokemonType.toLowerCase() == 'fire' ? 'bg-red-200/20' : pokemonType.toLowerCase() == 'water' ? 'bg-blue-200/20' : 'bg-yellow-200/20'} rounded-2xl px-2`}
			>
				{pokemonType}
			</h1>
		</div>
	</div>
	<div class="type">
		<h1
			class={`${pokemonType.toLowerCase() == 'grass' ? 'bg-green-200' : pokemonType.toLowerCase() == 'fire' ? 'bg-red-200' : pokemonType.toLowerCase() == 'water' ? 'bg-blue-200' : 'bg-yellow-200'} rounded-2xl px-2`}
		>
			{pokemonType}
		</h1>
	</div>
</div>
