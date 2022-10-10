import { Observable } from 'rxjs';
import { Scope } from '../lib/store';

interface RootSlice {
	foo: number;
}
const scope = new Scope();

const rootSlice$ = scope.createRootSlice({ foo: 1 } as RootSlice, {
	defineInternals: (rootSlice) => {
		return { fooCount$: rootSlice.slice('foo') };
	},
});

rootSlice$.internals;

export interface BoxState {
	count: number;
}

export type PieKey = string;

export interface DeepDishState {
	pies: Record<PieKey, PieState>;
	boxes: BoxState[];
}

const deepdishSlice$ = rootSlice$.addSlice('deepdish', { pies: {}, boxes: [] } as DeepDishState);

const externalPiesActions = {
	createPie: scope.createAction('external create pie'),
	removePie: scope.createAction<PieKey>('external remove pie'),
};

const piesSlice$ = deepdishSlice$.slice('pies', {
	defineInternals: () => 1,
	reducers: [
		externalPiesActions.createPie.reduce((state) => {
			const nextKey = Object.keys(state)
				.map((key) => parseInt(key, 10))
				.reduce((a, b) => (a > b ? a : b), 0);
			console.log('get next key', nextKey);
			return { ...state, [nextKey.toString()]: { cheese: -1, sauce: -1 } };
		}),
	],
});

export interface PieState {
	sauce: number;
	cheese: number;
}

export type FigureThisOneOut = { cheese$: Observable<number>; sauce$: Observable<number> };

const pieDicer = piesSlice$.dice({
	getAllKeys: (state) => Object.keys(state),
	defineInternals: (slice) => {
		const cheese$ = slice.slice('cheese');
		const sauce$ = slice.slice('sauce');
		return { cheese$, sauce$, a: 2 };
	},
	initialState: { cheese: 1, sauce: 2 } as PieState,
});

// pieDicer.sliceKeys$.subscribe((pieKey) => console.log('pieKey', pieKey));

const firstPie = pieDicer.select('1');

firstPie.slice.internals; // .cheese$.subscribe();

console.log();

const boxes$ = deepdishSlice$.slice('boxes');

const boxDicer = boxes$.dice({
	getAllKeys: (state) => [...state.keys()],
	defineInternals: (_boxSlice) => 1,
	initialState: { count: 0 } as BoxState,
});

boxDicer.sliceKeys$;
boxDicer.select(0);
