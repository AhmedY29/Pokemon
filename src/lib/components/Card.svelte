<script lang="ts">
	import { goto } from '$app/navigation';

	export let pokemonId;
	export let pokemonName;
	export let pokemonType;

	const handleCardDetails = () => {
		setTimeout(() => {
			goto(`/pokemon/${pokemonId}`);
		}, 100);
	};
</script>

<button
	on:click={handleCardDetails}
	class="flex cursor-pointer items-end justify-between rounded border bg-zinc-100 p-5 transition-all duration-200 hover:bg-zinc-200 hover:shadow dark:bg-black hover:dark:bg-gray-900"
>
	<div class="title flex flex-col items-start gap-1">
		<h1 class="text-xl font-bold">
			{pokemonName}
		</h1>
		<div class="flex gap-2">
			<h1>
				#{pokemonId}
			</h1>
			<h1
				class={`${pokemonType.toLowerCase() == 'grass' ? 'bg-green-400/25' : pokemonType.toLowerCase() == 'fire' ? 'bg-red-400/25' : pokemonType.toLowerCase() == 'water' ? 'bg-blue-400/25' : 'bg-yellow-400/25'} rounded-2xl px-2 text-white dark:text-black`}
			>
				{pokemonType}
			</h1>
		</div>
	</div>
	<div class="type">
		<h1
			class={`${pokemonType.toLowerCase() == 'grass' ? 'bg-green-400' : pokemonType.toLowerCase() == 'fire' ? 'bg-red-400' : pokemonType.toLowerCase() == 'water' ? 'bg-blue-400' : 'bg-yellow-400'} rounded-2xl px-2 text-white dark:text-black`}
		>
			{pokemonType}
		</h1>
	</div>
</button>
