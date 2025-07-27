<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import X from '@lucide/svelte/icons/x';
	import Button from './ui/button/button.svelte';
	import Skeleton from './ui/skeleton/skeleton.svelte';

	type PokemonDetails = {
		abilities: [
			{
				ability: {
					name: string;
				};
			}
		];
		forms: [
			{
				name: string;
				url: string;
			}
		];
		types: [
			{
				type: {
					name: string;
				};
			}
		];

		stats: [
			{
				base_stat: number;
				stat: {
					name: string;
				};
			}
		];
		sprites: {
			front_default: string;
		};
	};

	let pokemon: PokemonDetails;

	let { id } = $page.params;
	let fetchErr = $state(null);
	let loading = $state(false);
	console.log(id, 'sssssssssssssssssssssssssssssssssss');

	const fetchData = async () => {
		loading = true;
		try {
			const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
			const data = await res.json();

			pokemon = data;
			console.log(pokemon, 'ss');
		} catch (error: any) {
			console.log(`Error in Get Pokemon Details: ${error.message}`);
			console.log(fetchErr, '1');
			fetchErr = error.message;
			console.log(fetchErr, '2');
		} finally {
			setTimeout(() => {
				loading = false;
			}, 200);
		}
		return;
	};

	const unsubscribe = page.subscribe(($page) => {
		id = $page.params.id;
		fetchData();
	});

	onDestroy(() => {
		unsubscribe();
	});

	const capitalizeNames = (name: string) => {
		return `${name[0].toUpperCase()}${name.slice(1)}`;
	};

	const handleBack = () => {
		goto('/');
	};
</script>

<!-- <svelte:head>
	<title>Pokemon {`${capitalizeNames(pokemon.forms[0].name)}`}</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head> -->

<div class="">
	{#if loading}
		<div class="flex flex-col items-center gap-5">
			<Skeleton class="mt-5 h-60 w-60 rounded" />
			<div class="mt-4.5 w-full">
				<Skeleton class="mt-5 h-5 w-25 rounded" />
				<div class="flex justify-between">
					<Skeleton class="mt-5 h-5 w-25 rounded" />
					<Skeleton class="mt-5 h-5 w-50 rounded" />
					<Skeleton class="mt-5 h-5 w-25 rounded" />
				</div>
				<div class="flex justify-between">
					<Skeleton class="mt-5 h-5 w-25 rounded" />
					<Skeleton class="mt-5 h-5 w-50 rounded" />
					<Skeleton class="mt-5 h-5 w-25 rounded" />
				</div>
				<div class="flex justify-between">
					<Skeleton class="mt-5 h-5 w-25 rounded" />
					<Skeleton class="mt-5 h-5 w-50 rounded" />
					<Skeleton class="mt-5 h-5 w-25 rounded" />
				</div>
				<div class="flex justify-between">
					<Skeleton class="mt-5 h-5 w-25 rounded" />
					<Skeleton class="mt-5 h-5 w-50 rounded" />
					<Skeleton class="mt-5 h-5 w-25 rounded" />
				</div>
			</div>
			<div class="w-full">
				<Skeleton class="mt-5 h-5 w-25 rounded" />
				<Skeleton class="mt-5 ml-5 h-5 w-25 rounded" />
				<Skeleton class="mt-5 ml-5 h-5 w-25 rounded" />
			</div>
		</div>
	{:else}
		<div class="flex flex-col">
			<div class="m-5 flex items-center justify-between">
				<div class="text flex items-center gap-2">
					<h1 class="text-xl font-bold">{capitalizeNames(pokemon.forms[0].name)}</h1>
					<h1 class="text-gray-400 dark:text-gray-200">#{id}</h1>
				</div>
				<Button size="sm" variant="outline" class="ml-auto hidden sm:block" onclick={handleBack}
					><X /></Button
				>
			</div>
			<hr />
			<div class="mx-10 flex flex-col gap-5">
				{#if fetchErr}
					<h1>Error In Get Pokemon Details</h1>
					<Button onclick={fetchData}>Retry</Button>
				{:else}
					<!-- <h1 on:click={handleBack} class="text-sky-500 hidden sm:block ml-auto" >X</h1> -->
					{#if !pokemon?.sprites.front_default}
						<Skeleton class="h-60 w-60 rounded" />
					{:else}
						<div class="flex w-full justify-center">
							<img class="w-55" src={pokemon?.sprites.front_default} alt="Pokemon_Image" />
						</div>
					{/if}

					<h1 class="text-xl font-medium">Base Stat</h1>
					<div class="stats">
						{#each pokemon?.stats as stat (stat.stat.name)}
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
							{#each pokemon?.abilities as ability (ability.ability.name)}
								<li class="ml-5">
									{capitalizeNames(ability?.ability.name)}
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
