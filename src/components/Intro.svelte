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

  h3, h1 {
    font-family: 'Lyon Text Web';
    text-align: center;
  }

  h3 {
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #bd3b32;
    font-size: 1.5rem;
    margin-top:4rem;
  }

  h1 {
    font-family: 'Walter Turncoat';
    margin: 0 auto;
    max-width: 50rem;
    font-size: 4rem;
    line-height: 1.2;
    margin-bottom:2rem;
    color:rgba(0,0,0,.8)
  }

  .intro {
    max-width: 500px;
    margin: 0 auto;
  }

  p {
    color: black;
    font-family: 'Lyon Text Web';
    font-size:1.3rem;
  }

  .byline p{
    text-align:center;
    font-size:1.1rem;
    margin-bottom:3rem;
    margin-top:2rem;
  }
  a:hover{
    border-bottom:1px solid black;
  }
</style>

<script>
  import doc from "../data/copy.json"
</script>

<p class="logo-wrapper">A project from the <a target="_blank" class="text-underline" href="/">The Pudding</a></p>

<h3>{doc.hed}</h3>
<h1>{doc.dek}</h1>
<div class="byline">
	<p>by <a target="_blank" href="https://pudding.cool/author/erin-davis/">Erin Davis</a></p>
</div>

<div class="intro">
  {#each doc.intro as intro}
    <p class='prose'>{@html intro.value}</p>
  {/each}
</div>
