<script lang="ts">
	import { base } from '$app/paths';
	// Most of your app wide CSS should be put in this file
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import packageJson from '../../../../package.json';
	import '../app.postcss';

	const pages = [
		{ label: 'Counter', href: `${base}/counter` },
		{ label: 'Deepdish', href: `${base}/deepdish` },
		{ label: 'Message', href: `${base}/message` },
		{ label: 'MouseMove', href: `${base}/mousemove` },
		{ label: 'Useless', href: `${base}/useless` },
	];
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">TinySlice</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="btn btn-sm variant-ghost-surface"
					href={packageJson.homepage}
					target="_blank"
					rel="noreferrer"
				>
					GitHub
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<div class="main-layout">
		<slot />
	</div>

	<svelte:fragment slot="sidebarLeft">
		<section class="space-y-4 overflow-y-auto p-4 pb-20">
			<p class="pl-4 text-2xl font-bold">Examples</p>
			<nav class="list-nav">
				<ul>
					{#each pages as { label, href }}
						<li>
							<a
								{href}
								data-sveltekit-preload-data={label === 'MouseMove'
									? 'off'
									: 'hover'}><span class="flex-auto">{label}</span></a
							>
						</li>
					{/each}
				</ul>
			</nav>
		</section>
	</svelte:fragment>
</AppShell>

<style>
	.main-layout {
		padding: 1em;
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;
	}
</style>
