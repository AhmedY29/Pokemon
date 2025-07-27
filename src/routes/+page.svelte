<script lang="ts">
	import { onMount } from 'svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

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
	let query = '';

	const selectedValues = $derived(types.filter((f: Types) => value.includes(f.name)));

	const fetchPokemonData = async () => {
		try {
			loading = true;
			let res = await fetch(`${Base_Url}pokemon?limit=50&offset=0`);
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
		} finally {
			loading = false;
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
		} finally {
			loading = false;
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

	onMount(() => {
		fetchPokemonData();
		fetchTypeData();
	});
</script>

<!-- <h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p> -->

<div class="m-10 flex flex-col gap-6">
	<div class="search flex w-full justify-between gap-2">
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
	<div class="cards flex flex-col gap-5 overflow-auto">
		{#if loading}
			<div><h1>Loading</h1></div>
		{:else}
			{#each filteredPokemonData as pokemon}
				<div
					class="flex items-end justify-between border bg-zinc-100 p-3 transition-all duration-200 hover:bg-zinc-200"
				>
					<div class="title">
						<h1>
							{capitalizeNames(pokemon.forms[0].name)}
						</h1>
						<div class="flex gap-2">
							<h1>
								#{extractId(pokemon.forms[0].url)}
							</h1>
							<h1
								class={`${pokemon.types[0].type.name == 'grass' ? 'bg-green-200/20' : pokemon.types[0].type.name == 'fire' ? 'bg-red-200/20' : pokemon.types[0].type.name == 'water' ? 'bg-blue-200/20' : 'bg-yellow-200/20'} rounded-2xl px-2`}
							>
								{capitalizeNames(pokemon.types[0].type.name)}
							</h1>
						</div>
					</div>
					<div class="type">
						<h1
							class={`${pokemon.types[0].type.name == 'grass' ? 'bg-green-200' : pokemon.types[0].type.name == 'fire' ? 'bg-red-200' : pokemon.types[0].type.name == 'water' ? 'bg-blue-200' : 'bg-yellow-200'} rounded-2xl px-2`}
						>
							{capitalizeNames(pokemon.types[0].type.name)}
						</h1>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
