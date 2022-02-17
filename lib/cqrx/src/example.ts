import { map, mapTo, tap } from 'rxjs/operators';
import { Action } from './action/action.class';
import { Effect } from './effect/effect.class';
import { Store } from './store';

const printAction = new Action<string>('printAction');
const countAction = new Action<number>('countAction');

const innerAction = new Action<number>('innerAction');

Action.listenAll$()
	.pipe(tap((a) => console.log(`[${a.type}]`)))
	.subscribe();

Action.listen$(printAction)
	.pipe(tap((a) => console.log('a2', a.payload)))
	.subscribe();

// Do I really need effects? I can just use the action itself since it is also
// the dispatcher
Effect.from(
	Action.listen$(countAction).pipe(mapTo({ type: printAction.type, payload: 'eat this' }))
);

// printAction.next('Hello');
// countAction.next(12);

export interface ExampleState {
	lastPrinted: string | undefined;
	lastCounted: number | undefined;
	foo: {
		bar: {
			zed: number;
		};
	};
	ger: {
		ber: {
			yon: number;
		};
	};
}

const store = new Store<ExampleState>(
	{
		lastPrinted: undefined,
		lastCounted: undefined,
		foo: { bar: { zed: 2 } },
		ger: { ber: { yon: 3 } },
	},
	[
		printAction.reduce((state, payload) => ({ ...state, lastPrinted: payload })),
		countAction.reduce((state, payload) => ({ ...state, lastCounted: payload })),
	]
);

store.subscribe((state) => console.log('Full State', JSON.stringify(state)));

const lastPrintedSlice = store.slice<ExampleState['lastPrinted']>(
	(state) => state.lastPrinted,
	(lastPrinted) => ({ lastPrinted })
	// [innerAction.reduce((state, payload) => `${state}${payload}`)]
);

const fooSlice = store.slice<'foo'>('foo', [
	printAction.reduce((state, payload) => {
		console.log('diced foo print', payload);
		return { ...state, bar: { zed: state.bar.zed + 1 } };
	}),
	innerAction.reduce((state, payload) => {
		console.log('inner action just ran');
		return { ...state, bar: { zed: payload } };
	}),
]);

const rootStore = fooSlice.root<ExampleState>();
console.log('isCorrect', rootStore === store);

const barSlice = fooSlice.slice(
	(state) => state.bar,
	(bar) => ({ bar })
);

barSlice.subscribe((bar) => console.log('bar', bar));
lastPrintedSlice.subscribe((lastPrinted) => console.log('lastPrinted', lastPrinted));

innerAction.next(1);
// printAction.next('Hello!');
// printAction.next('World!');
// countAction.next(1);

const newBarSlice = barSlice.addSlice<{ ns: number }, 'newBarSlice'>(
	{ ns: 1 },
	(state) => state.newBarSlice,
	(newBarSlice) => ({ newBarSlice }),
	[countAction.reduce((s) => ({ ...s, ns: s.ns + 1 }))]
);

newBarSlice.pipe(map((a) => a?.ns)).subscribe((ns) => console.log('ns', ns));
