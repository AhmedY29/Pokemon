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

	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Menu } from 'lucide-svelte';
	import Sidebar from './Sidebar.svelte';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import type { PokemonDetails, Types } from '$lib/types';
	import { loading, loadMoreLoading } from '$lib/stores/store';
	import CardsList from './CardsList.svelte';

	let { pokemonList, types, handleRetry, handleLoadMore } = $props();

	let open = $state(false);
	let value = $state<string[]>([]);
	let triggerRef = $state<HTMLButtonElement>(null!);

	console.log($loading, 'loading page ');
	console.log($loadMoreLoading, 'load more ');

	let filteredPokemonData = $state<PokemonDetails[]>([]);
	let query = $state('');

	let selectedValues = $derived(types?.filter((f: Types) => value.includes(f.name)));

	$effect(() => {
		filteredPokemonData = pokemonList;
	});

	const capitalizeNames = (name: string) => {
		return `${name[0].toUpperCase()}${name.slice(1)}`;
	};
	const extractId = (url: string) => {
		return url.split('/')[6];
	};

	const handleSearch = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const search = target.value.trim();

		const currentParams = new URLSearchParams(get(page).url.search);

		if (search) {
			currentParams.set('q', search);
		} else {
			currentParams.delete('q');
		}

		goto(`?${currentParams.toString()}`, { replaceState: true });

		filterPokemonList(search, selectedValues);
	};

	const handleSelectType = () => {
		const currentParams = new URLSearchParams(get(page).url.search);

		if (selectedValues?.length > 0) {
			const typeString = selectedValues.map((e: Types) => e.name).join(',');
			currentParams.set('type', typeString);
		} else {
			currentParams.delete('type');
		}

		goto(`?${currentParams.toString()}`, { replaceState: true });

		const search = currentParams.get('q') ?? '';
		filterPokemonList(search, selectedValues);
	};

	const filterPokemonList = (search: string, selectedValues: Types[]) => {
		filteredPokemonData = pokemonList;

		if (selectedValues?.length > 0) {
			filteredPokemonData = filteredPokemonData.filter((pokemon: any) =>
				selectedValues.some((e: Types) => pokemon.types[0].type.name == e.name)
			);
		}

		if (search) {
			filteredPokemonData = filteredPokemonData.filter((pokemon: any) =>
				pokemon.forms[0].name.includes(search.toLowerCase())
			);
		}
	};

	const handleClickLoadMore = async () => {
		query = '';
		value = [];
		selectedValues = [];

		const currentParams = new URLSearchParams(get(page).url.search);
		currentParams.delete('q');
		currentParams.delete('type');

		const newUrl = currentParams.toString();
		goto(newUrl ? `?${newUrl}` : '?', { replaceState: true });
	};

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const search = params.get('q') ?? '';
		const types = params.get('type')?.split(',') ?? [];

		query = search;
		selectedValues = types.map((name) => ({ name }));

		filterPokemonList(search, selectedValues);
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
				bind:value={query}
				onchange={handleSearch}
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
						{#if selectedValues?.length > 0}
							{selectedValues?.length > 3
								? `${selectedValues?.map((f: Types) => capitalizeNames(f.name)).slice(0, 3)}...`
								: selectedValues?.map((f: Types) => capitalizeNames(f.name))}
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
											handleSelectType();
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
	<div
		style="scrollbar-width: none;"
		class="cards flex h-[90%] max-h-[80vh] flex-col gap-5 overflow-auto"
	>
		{#if $loading}
			<div class="flex flex-col gap-6">
				<Skeleton class="h-25 rounded " />
				<Skeleton class="h-25 rounded " />
				<Skeleton class="h-25 rounded " />
				<Skeleton class="h-25 rounded " />
				<Skeleton class="h-25 rounded " />
				<Skeleton class="h-25 rounded " />
			</div>
		{:else if pokemonList == undefined}
			<h1>Error In Get Pokemon Details</h1>
			<Button onclick={handleRetry}>Retry</Button>
		{:else}
			<CardsList {filteredPokemonData} {capitalizeNames} />
			{#if filteredPokemonData?.length == 0 && !$loading}
				<h1>Not Found Pokemon "{query ? query : value}"</h1>
			{/if}
			<div class="flex justify-center">
				<Button
					class="w-32 cursor-pointer"
					onclick={() => (handleLoadMore(), handleClickLoadMore())}
					disabled={$loadMoreLoading}>{$loadMoreLoading ? 'loading...' : 'More'}</Button
				>
			</div>
		{/if}
	</div>
</div>
