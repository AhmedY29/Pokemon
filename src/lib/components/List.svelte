<script lang="ts">
	import { onMount } from 'svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import Card from '$lib/components/Card.svelte';

	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Menu } from 'lucide-svelte';
	import Sidebar from './Sidebar.svelte';

	const Base_Url = 'https://pokeapi.co/api/v2/';

	type Pokemon = {
		name: string;
		url: string;
	};

	type Types = {
		name: string;
		url: string;
	};

	type PokemonDetails = {
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
	};

	let open = $state(false);
	let value = $state<string[]>([]);
	let triggerRef = $state<HTMLButtonElement>(null!);

	let pokemonData: PokemonDetails[] = [];
	let filteredPokemonData = $state<PokemonDetails[]>([]);
	let types = $state<Types[]>([]);
	let next: string = '';
	let loading = $state(false);
	let moreDataLoading = $state(false);
	let query = $state('');
	let fetchErr = $state(null);

	let selectedValues = $derived(types.filter((f: Types) => value.includes(f.name)));

	const fetchPokemonData = async () => {
		try {
			loading = true;
			let res = await fetch(`${Base_Url}pokemon?limit=10&offset=0`);
			let data = await res.json();
			console.log(data, 'pokemon data from list api');
			next = data.next;
			// For Extract Pokemon Details -> Type
			let details = await Promise.all(
				data.results.map(async (pokemon: Pokemon) => {
					let res = await fetch(pokemon.url);
					return await res.json();
				})
			);
			pokemonData = details;
			filteredPokemonData = pokemonData;
			console.log(pokemonData, 'pokemon data');
		} catch (error: any) {
			console.log(error.message, 'error');
			fetchErr = error.message;
		} finally {
			setTimeout(() => {
				loading = false;
			}, 200);
		}
	};

	const fetchTypeData = async () => {
		try {
			loading = true;
			let res = await fetch(`${Base_Url}type`);
			let data = await res.json();
			types = data.results;
			console.log(types, 'type');
		} catch (error: any) {
			console.log(error.message, 'type error');
			fetchErr = error.message;
		} finally {
			setTimeout(() => {
				loading = false;
			}, 200);
		}
	};

	const capitalizeNames = (name: string) => {
		return `${name[0].toUpperCase()}${name.slice(1)}`;
	};
	const extractId = (url: string) => {
		return url.split('/')[6];
	};

	const handelSearch = (e: Event) => {
		let target = e.target as HTMLSelectElement;
		let search = target.value;

		filteredPokemonData =
			selectedValues.length > 0
				? pokemonData.filter((pokemon) =>
						selectedValues.some((e: Types) => pokemon.types[0].type.name == e.name)
					)
				: pokemonData;

		filteredPokemonData =
			selectedValues.length == 0
				? pokemonData.filter((pokemon) => pokemon.forms[0].name.includes(search))
				: filteredPokemonData.filter((pokemon) => pokemon.forms[0].name.includes(search));
	};

	const handelSelectType = () => {
		if (selectedValues.length == 0) {
			filteredPokemonData = pokemonData;
		} else {
			filteredPokemonData = pokemonData.filter((pokemon) =>
				selectedValues.some((e: Types) => pokemon.types[0].type.name == e.name)
			);
		}
	};

	const handleLoadMore = async () => {
		moreDataLoading = true;
		try {
			const res = await fetch(next);
			const data = await res.json();
			next = data.next;
			let details = await Promise.all(
				data.results.map(async (pokemon: Pokemon) => {
					let res = await fetch(pokemon.url);
					return await res.json();
				})
			);
			pokemonData = [...pokemonData, ...details];
			filteredPokemonData = pokemonData;
			query = '';
			value = [];
			selectedValues = [];
		} catch (error: any) {
			console.log(`Error in Load More: ${error.message}`);
		} finally {
			moreDataLoading = false;
		}
	};

	onMount(() => {
		fetchPokemonData();
		fetchTypeData();
	});
</script>

<!-- <h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p> -->

<div class="m-10 flex flex-col gap-6">
	<div class="search flex w-full justify-between gap-2">
		<div class="lg:hidden">
			<Sheet.Root>
				<Sheet.Trigger class={buttonVariants({ variant: 'outline' })}><Menu /></Sheet.Trigger>
				<Sheet.Content side="left">
					<Sidebar />
				</Sheet.Content>
			</Sheet.Root>
		</div>
		<div class="flex w-full flex-col gap-2 md:flex-row">
			<Input
				type="text"
				placeholder="Search For Pokemon"
				value={query}
				onchange={handelSearch}
				class=""
			/>

			<Popover.Root bind:open>
				<Popover.Trigger bind:ref={triggerRef}>
					<Button
						variant="outline"
						class="w-full justify-between md:w-fit"
						role="combobox"
						aria-expanded={open}
					>
						{#if selectedValues.length > 0}
							{selectedValues.length > 3
								? `${selectedValues.map((f: Types) => capitalizeNames(f.name)).slice(0, 3)}...`
								: selectedValues.map((f: Types) => capitalizeNames(f.name))}
						{:else}
							Select Type...
						{/if}
						<ChevronsUpDownIcon class="opacity-50" />
					</Button>
				</Popover.Trigger>

				<Popover.Content class="w-60 p-0">
					<Command.Root>
						<Command.Input placeholder="Search types..." />
						<Command.List>
							<Command.Empty>No type found.</Command.Empty>
							<Command.Group value="types">
								{#each types as type (type.name)}
									<Command.Item
										value={type.name}
										onSelect={() => {
											if (value.includes(type.name)) {
												value = value.filter((v) => v !== type.name);
											} else {
												value = [...value, type.name];
											}
											handelSelectType();
										}}
									>
										<CheckIcon class={cn(!value.includes(type.name) && 'text-transparent')} />
										{capitalizeNames(type.name)}
									</Command.Item>
								{/each}
							</Command.Group>
						</Command.List>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
		</div>
	</div>
	<div style="scrollbar-width: none;" class="cards flex max-h-[75vh] flex-col gap-5 overflow-auto">
		{#if loading}
			<div class="flex flex-col gap-6">
				<Skeleton class="h-25 rounded " />
				<Skeleton class="h-25 rounded " />
				<Skeleton class="h-25 rounded " />
				<Skeleton class="h-25 rounded " />
				<Skeleton class="h-25 rounded " />
				<Skeleton class="h-25 rounded " />
			</div>
		{:else if fetchErr}
			<h1>Error In Get Pokemon Details</h1>
			<Button onclick={fetchPokemonData}>Retry</Button>
		{:else}
			{#each filteredPokemonData as pokemon}
				<Card
					pokemonName={capitalizeNames(pokemon.forms[0].name)}
					pokemonId={extractId(pokemon.forms[0].url)}
					pokemonType={capitalizeNames(pokemon.types[0].type.name)}
				/>
			{/each}
			{#if filteredPokemonData.length == 0 && !loading}
				<h1>No Found Pokemon</h1>
			{/if}
			<div class="flex justify-center">
				<Button class="w-32 cursor-pointer" onclick={handleLoadMore} disabled={moreDataLoading}
					>{moreDataLoading ? 'loading...' : 'More'}</Button
				>
			</div>
		{/if}
	</div>
</div>
