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
    width: 95%;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #bd3b32;

    font-size: 1.3rem;
    margin-top:4rem;
  }

  h1 {
    font-family: 'Walter Turncoat';
    margin: 0 auto;
    width: 95%;
    max-width: 50rem;
    font-size: 4rem;
    line-height: 1.2;
    margin-bottom:2rem;
    color:rgba(0,0,0,.8);
  }

  @media (max-width: 600px){
    h1 {
      font-size: 3rem;
    }
  }

  @media (max-width: 400px){
    h1 {
      font-size: 2.5rem;
    }
  }

  @media (max-width: 330px){
    h1 {
      font-size: 2rem;
    }
  }

  .intro {
    max-width: 40rem;
    margin: 0 auto;
  }

  p {
    color:rgba(0,0,0,.8);
    font-family: 'Lyon Text Web';
    font-size:1.3rem;
    width: 95%;
    margin: 0 auto;
    margin-bottom: 1.5rem;
    max-width: 60rem;
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

  ul li {
    font-family: 'Lyon Text Web';
    font-size: 1.3rem;
    color:rgba(0,0,0,.8);
    margin-bottom: 1.3rem;
    line-height:1.65;
    margin-left: 2rem;
    list-style-type: disc;
    padding-left: 1rem;
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
  <ul>
    {#each doc.outro as outro}
      <li class='prose bullet'>{@html outro.value}</li>
    {/each}
  </ul>
</div>
