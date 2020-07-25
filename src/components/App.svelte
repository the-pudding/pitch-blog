<style>

  @font-face {
  	font-family: 'Lyon Display Web';
  	src: url('./../assets/fonts/lyon/LyonDisplay-Regular-Web.woff2') format('woff2'),
  	url('./../assets/fonts/lyon/LyonDisplay-Regular-Web.woff') format('woff');
  	font-weight: 300;
  	font-style: normal;
  	font-stretch: normal;
  	font-display: swap;
  }
  @font-face {
  	font-family: 'Lyon Text Web';
  	src: url('./../assets/fonts/lyon/LyonText-Regular-Web.woff2') format('woff2'),
  	url('./../assets/fonts/lyon/LyonText-Regular-Web.woff') format('woff');
  	font-weight: 300;
  	font-style: normal;
  	font-stretch: normal;
  	font-display: swap;
  }

  p {
    text-align: left;
    font-family: 'Lyon Text Web';
    margin: 0 auto;
    margin-bottom: 1.5rem;
    line-height: 1.4;
    font-size: 1.4rem;
    color: rgba(0,0,0,.8);

  }

  h1 {
    font-size: 6rem;
    font-family: 'Lyon Display Web', sans-serif;
  }

  svg {
    display: block;
    width: 10rem;
  }

  strong {
    color: var(--c2);
  }

  .intro {
    max-width: 500px;
    margin: 0 auto;
  }

  img {
    width: 20rem;
    display: block;
  }

  .chart {
    position: relative;
    width: 20rem;
    height: 20rem;
    background: pink;
  }




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

<h1>{doc.hed}</h1>

<main id="main">
  <div class="intro">
    {#each doc.intro as intro}
      <p class='prose'>{@html intro.value}</p>
    {/each}
  </div>
</main>


{#each petData as { name, pet }}
  <p>
    {name} has
    <strong>{pet}.</strong>
  </p>
{/each}

<img alt="smokey" src="assets/smokey.jpg" />
<Child />

<div class="chart">
  <LayerCake data="{points}" x="x" y="y" {padding}>
    <Svg>
      <Scatter {r} />
    </Svg>
  </LayerCake>
</div>
