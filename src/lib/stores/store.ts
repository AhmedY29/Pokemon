import { writable } from 'svelte/store';

export const pokemonList: any = writable([]);
export const pokemonTypes = writable([]);
export const query = writable('');
export const typeValue = writable([]);
export const selectedTypeValues = writable([]);
export const nextUrl = writable('');

// 		value = [];
// 		selectedValues = [];
