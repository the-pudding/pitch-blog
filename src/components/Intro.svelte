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
		src: url('./assets/fonts/lyon/LyonText-Regular-Web.woff2') format('woff2'),
		url('./assets/fonts/lyon/LyonText-Regular-Web.woff') format('woff');
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
    margin: 0 auto;
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
  import { onMount } from 'svelte';
  import * as d3 from "d3";

  let annotations = ["#annotation1","#annotation1return", "#annotation2","#annotation2return","#annotation3","#annotation3return","#annotation4","#annotation4return","#annotation5","#annotation5return"]

  onMount(() => {
    d3.selectAll("a").attr("target",function(d){
      if(annotations.indexOf(d3.select(this).attr("href")) > -1 ){
        if(d3.select(this).attr("href").slice(-6) != "return"){
          d3.select(this).attr("id",d3.select(this).attr("href")+"return");
          d3.select(this).attr("name",d3.select(this).attr("href").replace("#","")+"return");
        }

        return null;
      }
      return "_blank";
    });
  });

</script>

<p class="logo-wrapper">A project from the <a target="_blank" class="text-underline" href="/">The Pudding</a></p>

<h3>{doc.hed}</h3>
<h1>{doc.dek}</h1>
<div class="byline">
	<p>by <a target="_blank" href="https://pudding.cool/author/erin-davis/">Erin Davis</a></p>
</div>


<div class="intro">
  <p class="prose">I’m published! In the Pudding! Check it out <a href=https://pudding.cool/2020/07/gendered-descriptions/ >here</a>!</p>
  <div class="tweet-wrapper">
    <blockquote class="twitter-tweet">
    <p lang="en" dir="ltr">Curl up with a good book and you&#39;re likely to read about women with &quot;soft lips&quot; and men with &quot;broad shoulders.&quot; Women often are reduced to their sexuality—men to their strength. We examined 2K books to see how authors describe men&#39;s/women&#39;s physical traits <a href="https://t.co/D8ENhf7ESI">https://t.co/D8ENhf7ESI</a> <a href="https://t.co/3evlTo6JMV">pic.twitter.com/3evlTo6JMV</a></p>&mdash; The Pudding (@puddingviz) <a href="https://twitter.com/puddingviz/status/1283782162622414849?ref_src=twsrc%5Etfw">July 16, 2020</a></blockquote>
  </div>
  {#each doc.intro as intro}
    <p class='prose'>{@html intro.value}</p>
  {/each}
  <ul>
    {#each doc.outro as outro}
      <li class='prose bullet'>{@html outro.value}</li>
    {/each}
  </ul>
  <div class="footnotes">
    <!-- <div class="item"><a style="border: none;" name="annotation1">Notes from The Pudding team:
    </div>
    <div class="item"><a style="border: none;" name="annotation1">1.</a> We pay $5,000+ for end-to-end work on an essay. If we collaborate by providing some assistance in a non-editor capacity (e.g., we do the design), we will lower the compensation accordingly. <a class="return" href="#annotation1return">↩</a>
    </div>
    <div class="item"><a style="border: none;" name="annotation2">2.</a> Reading this reinforced to us how important it is for us to send a timely response. We have a policy to send an acknowledgement email ASAP after receiving a pitch, and we have a standing meeting at midday EST on Monday to review each one. Our goal is to respond within a week with more detailed feedback. <a class="return" href="#annotation2return">↩</a>
    </div>
    <div class="item"><a style="border: none;" name="annotation3">3.</a> We respond to every pitch email with feedback, even if we decline to pursue it. <a class="return" href="#annotation3return">↩</a>
    </div>
    <div class="item"><a style="border: none;" name="annotation4">4.</a> The time from conception to completion varies from contributor to contributor. Many of the people we collaborate with are working full-time elsewhere and have limited time per week to spend on a story. At that rate, projects often take several months to complete. If a contributor has more time available per week to contribute, we do our best to help move stories along at a faster pace. <a class="return" href="#annotation4return">↩</a>
    </div>
    <div class="item"><a style="border: none;" name="annotation5">5.</a> We collaborate with people of all skill sets and skill levels. We assign an editor to every freelance pitch we take on, so there's always someone to bounce ideas off of and problem solve with you. <a class="return" href="#annotation5return">↩</a>
    </div> -->
    <div class="item"><a style="border: none;" name="annotation5">See The Pudding&rsquo;s <a href="https://pudding.cool/about/#pitch">full pitch guidelines</a> for more info including what to send, how the team collaborates, and compensation details.
    </div>
  </div>
</div>
