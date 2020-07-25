<style>
  @font-face {
  	font-family: 'Lyon Display Web';
  	src: url('assets/fonts/lyon/LyonDisplay-Regular-Web.woff2') format('woff2'),
  	url('assets/fonts/lyon/LyonDisplay-Regular-Web.woff') format('woff');
  	font-weight: 300;
  	font-style: normal;
  	font-stretch: normal;
  	font-display: swap;
  }
  @font-face {
  	font-family: 'Lyon Text Web';
  	src: url('assets/fonts/lyon/LyonText-Regular-Web.woff2') format('woff2'),
  	url('assets/fonts/lyon/LyonText-Regular-Web.woff') format('woff');
  	font-weight: 300;
  	font-style: normal;
  	font-stretch: normal;
  	font-display: swap;
  }

  p {
    text-align: left;
    font-family: 'Lyon Text Web';
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 6rem;
    font-family: 'Walter Turncoat', sans-serif;
  }

  svg {
    display: block;
    width: 10rem;
  }

</style>

<script>
  import doc from "../data/copy.json"
</script>

<h3>{doc.hed}</h3>
<h1>{doc.dek}</h1>

<main id="main">
  <div class="intro">
    {#each doc.intro as intro}
      <p class='prose'>{@html intro.value}</p>
    {/each}
  </div>
</main>
