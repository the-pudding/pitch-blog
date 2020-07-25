<style global src="./../styles/reset.styl">
</style>


<script>
  import { onMount } from "svelte";
  import { LayerCake, Svg } from "layercake";
  import Child from "./Child.svelte";
  import Intro from "./Intro.svelte";

  import Scatter from "./Scatter.svelte";
  import petData from "../data/pets.csv";
  import user from "tabler-icons/icons/user.svg";
  import Meta from "./Meta.svelte";
  import doc from "../data/copy.json"

  let name = "Loading";

  const points = [{ x: 0, y: 1 }, { x: 10, y: 5 }, { x: 15, y: 10 }];
  const r = 6;
  const padding = { top: r * 2, right: r * 2, bottom: r * 2, left: r * 2 };


  onMount(() => (name = "User"));
</script>

<svelte:head>
  <Meta />
</svelte:head>

<Intro />
