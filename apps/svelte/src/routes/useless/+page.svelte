<script lang="ts">
	import { onDestroy } from 'svelte';

	import { isOn$ } from './useless.slice.js';

	const subscription = isOn$.subscribe((isOn) => {
		console.log('isOn?', isOn);
	});

	onDestroy(() => {
		subscription.unsubscribe();
	});
</script>

<div class="mousemovetest">
	<h1>
		<span class="strikethrought" class:nonstrikethrought={$isOn$}>Working</span>
		Useless Machine
	</h1>

	{#if $isOn$}
		<button type="button" class="btn variant-filled" on:click={() => isOn$.set(false)}>
			Turn off!
		</button>
		<span>Can't see me!</span>
	{:else}
		<button type="button" class="btn variant-filled" on:click={() => isOn$.set(true)}>
			Turn on!
		</button>
	{/if}

	<p>
		The point of this demonstration is that an effect setting the same state which is caused it
		to trigger is always happening after the original reduce, and as fast as it can. The latter
		is achieved using the asapScheduler of RxJS! Otherwise you'd the button flash it's text.
		(The template has an if/else!)
	</p>
</div>

<style>
	.mousemovetest {
		display: flex;
		gap: 2em;
		flex-direction: column;
	}

	span.strikethrought {
		text-decoration: line-through;
	}

	span.nonstrikethrought {
		text-decoration: none;
	}
</style>
