<script lang="ts">
	export let title: string;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="w-full flex items-center justify-center shadow">
	<p class="text-xl py-2">{title}</p>
</div>
