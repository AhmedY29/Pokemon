<script lang="ts">
	import { TextSearch } from 'lucide-svelte';
	import ModeSwitcher from './ModeSwitcher.svelte';
	import { goto } from '$app/navigation';
</script>

<div class="flex h-full w-full flex-col items-center justify-between">
	<div class="top m-2 w-[90%]">
		<div class="title flex items-center">
			<img width="50" src="/PokeballLogo.png" alt="logo" />
			<h1 class="text-xl font-bold">Pokémon Explorer</h1>
		</div>
		<ul class="m-3">
			<a
				href="/"
				class=" flex w-full cursor-pointer items-center gap-3 rounded border bg-zinc-100 p-3 hover:bg-zinc-200 dark:bg-zinc-700 hover:dark:bg-zinc-600"
			>
				<TextSearch /><span class="text-lg">Explore</span>
			</a>
		</ul>
	</div>
	<div class="bottom flex w-[90%] items-center justify-between py-5">
		<h1 class="great-vibes text-2xl">
			Pokémon Explore By <span class="text-green-400">Ahmed</span>
		</h1>
		<ModeSwitcher />
	</div>
</div>
