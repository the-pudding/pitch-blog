<style global src="./../styles/global.styl">
</style>

<script>
  import { onMount } from "svelte";
  import { LayerCake, Svg } from "layercake";
  import Intro from "./Intro.svelte";
  import Footer from "./Footer.svelte";
  import Meta from "./Meta.svelte";
  import doc from "../data/copy.json"
</script>

<svelte:head>
  <Meta />
</svelte:head>

<Intro />
<Footer />
