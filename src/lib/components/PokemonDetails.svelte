<script lang="ts">
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import X from '@lucide/svelte/icons/x';
	import Button from './ui/button/button.svelte';
	import Skeleton from './ui/skeleton/skeleton.svelte';

	let { pokemonData } = $props();

	let { id } = $state($page.params);

	const unsubscribe = page.subscribe(($page) => {
		id = $page.params.id;
	});

	onDestroy(() => {
		unsubscribe();
	});

	const capitalizeNames = (name: string) => {
		return `${name[0].toUpperCase()}${name.slice(1)}`;
	};
</script>

<svelte:head>
	<title
		>Pokemon {pokemonData?.pokemonName
			? capitalizeNames(pokemonData?.pokemonName)
			: 'Loading'}</title
	>
</svelte:head>

<div class="">
	{#if !pokemonData}
		<h1>Error In Get Pokemon Details</h1>
		<Button class="cursor-pointer">Retry</Button>
	{:else}
		<div class="flex flex-col">
			<div class="m-5 flex items-center justify-between">
				<div class="text flex items-center gap-2">
					<h1 class="text-xl font-bold">{capitalizeNames(pokemonData.pokemonName)}</h1>
					<h1 class="text-gray-400 dark:text-gray-200">#{id}</h1>
				</div>
				<a href="/">
					<Button size="sm" variant="outline" class="ml-auto hidden cursor-pointer sm:block"
						><X /></Button
					>
				</a>
			</div>
			<hr />
			<div class="mx-10 mb-0 flex flex-col gap-5 md:mb-5">
				<!-- <h1 on:click={handleBack} class="text-sky-500 hidden sm:block ml-auto" >X</h1> -->
				{#if !pokemonData?.pokemonImg}
					<Skeleton class="h-60 w-60 rounded" />
				{:else}
					<div class="flex w-full justify-center">
						<img class="w-40 md:w-55" src={pokemonData?.pokemonImg} alt="Pokemon_Image" />
					</div>
				{/if}

				<h1 class="text-xl font-medium">Base Stat</h1>
				<div class="stats flex flex-col gap-2">
					{#each pokemonData?.stats as stat (stat.stat.name)}
						<div class="stat flex w-full items-center justify-between gap-5">
							<h1 class="w-25">{capitalizeNames(stat.stat.name)}</h1>
							<!-- <div class={`h-1 w-[${stat.base_stat}%] bg-blue-500 border-b border-blue-900`}>ss</div> -->
							<Progress value={stat.base_stat} />

							<h1>{stat.base_stat}</h1>
						</div>
					{/each}
				</div>

				<div class="abilities w-full text-start">
					<h1 class="text-xl font-medium">Abilities</h1>
					<ul>
						{#each pokemonData?.abilities as ability (ability.name)}
							<li>
								{capitalizeNames(ability.name)}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	{/if}
</div>
