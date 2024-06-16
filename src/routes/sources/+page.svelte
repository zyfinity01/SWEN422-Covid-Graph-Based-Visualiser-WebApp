<script lang="ts">
	import Navigation from '$lib/Navigation.svelte';
</script>

<Navigation page="Sources" />

<div class="flex items-center justify-center my-5">
	<h1 class="text-2xl font-semibold mt-4 text-white">Data Sources</h1>
</div>

<div class="flex-col space-y-4">
	<div class="mx-5 rounded-xl bg-white flex border-white border">
		<img
			src="https://avatars.githubusercontent.com/u/14187135?s=200&v=4"
			alt="Our World in Data"
			class="h-[200px] rounded-l-xl hidden lg:visible"
		/>
		<div class="flex flex-col mx-5 my-3">
			<h2 class="text-xl font-semibold text-slate-800">Our World in Data</h2>
			<p>
				Our World in Data provides a comprehensive dataset on Covid-19. The data is updated daily
				and is available in CSV format.
			</p>

			<div class="flex gap-12">
				<div class="flex flex-col mt-3">
					<h3 class="text-lg font-semibold text-slate-800">License</h3>
					<a href="https://creativecommons.org/licenses/by/4.0/">
						<img
							class="h-14 p-3"
							src="https://mirrors.creativecommons.org/presskit/logos/cc.logo.large.png"
							alt="Creative Commons License"
						/>
					</a>
				</div>

				<div class="flex flex-col mt-3">
					<h3 class="text-lg font-semibold text-slate-800">Download</h3>
					<button class="bg-blue-400 rounded-xl text-white p-3 my-1">
						<a
							href="https://github.com/owid/covid-19-data/blob/master/public/data/owid-covid-data.csv"
							class="text-l">Source (GitHub)</a
						>
					</button>
				</div>
			</div>
		</div>
	</div>

	<div class="mx-5 rounded-xl bg-white flex border-white border">
		<img
			src="https://acslm.ie/wp-content/uploads/2020/03/WHO-Logo.jpg"
			alt="Our World in Data"
			class="h-[200px] w-30 rounded-l-xl hidden lg:visible"
		/>
		<div class="flex flex-col mx-5 my-3">
			<h2 class="text-xl font-semibold text-slate-800">World Health Organisation</h2>
			<p>
				The World Health Organisation provides a comprehensive dataset on daily Covid-19 cases and
				deaths by date - Updated weekly.
			</p>

			<div class="flex gap-12">
				<div class="flex flex-col mt-3">
					<h3 class="text-lg font-semibold text-slate-800">License</h3>
					<a href="https://creativecommons.org/licenses/by/4.0/">
						<img
							class="h-14 p-3"
							src="https://mirrors.creativecommons.org/presskit/logos/cc.logo.large.png"
							alt="Creative Commons License"
						/>
					</a>
				</div>

				<div class="flex flex-col mt-3">
					<h3 class="text-lg font-semibold text-slate-800">Download</h3>
					<button class="bg-blue-400 rounded-xl text-white p-3 my-1">
						<a
							href="https://srhdpeuwpubsa.blob.core.windows.net/whdh/COVID/WHO-COVID-19-global-data.csv"
							class="text-l">Source (WHO)</a
						>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
