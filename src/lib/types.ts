export type Pokemon = {
	name: string;
	url: string;
};

export type Types = {
	name: string;
	url: string;
};

export type PokemonDetails = {
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
