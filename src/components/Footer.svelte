<style global src="./../styles/footer.styl">
</style>

<script>
  import * as d3 from "d3";
  import { onMount } from 'svelte';

  const fallbackData = [
  {
    image: "2018_02_stand-up",
    url: "2018/02/stand-up",
    hed: "The Structure of Stand-Up Comedy"
  },
  {
    image: "2018_04_birthday-paradox",
    url: "2018/04/birthday-paradox",
    hed: "The Birthday Paradox Experiment"
  },
  {
    image: "2018_11_boy-bands",
    url: "2018/11/boy-bands",
    hed: "Internet Boy Band Database"
  },
  {
    image: "2018_08_pockets",
    url: "2018/08/pockets",
    hed: "Women’s Pockets are Inferior"
  }
  ];
  //
  let storyData = null;

  function loadJS(src, cb) {
  const ref = document.getElementsByTagName("script")[0];
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);

  if (cb && typeof cb === "function") {
    script.onload = cb;
  }

  return script;
  }

  function loadStories(cb) {
  const request = new XMLHttpRequest();
  const v = Date.now();
  const url = `https://pudding.cool/assets/data/stories.json?v=${v}`;
  request.open("GET", url, true);

  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      const data = JSON.parse(request.responseText);
      cb(data);
    } else cb(fallbackData);
  };

  request.onerror = () => cb(fallbackData);

  request.send();
  }

  function createLink(d) {
  return `
  <a class='footer-recirc__article' href='https://pudding.cool/${d.url}' target='_blank' rel='noopener'>
    <img class='article__img' src='https://pudding.cool/common/assets/thumbnails/640/${d.image}.jpg' alt='${d.hed}'>
    <p class='article__headline'>${d.hed}</p>
  </a>
  `;
  }

  function recircHTML() {
    const url = window.location.href;
    const html = storyData
      .filter(d => !url.includes(d.url))
      .slice(0, 4)
      .map(createLink)
      .join("");

    d3.select(".pudding-footer .footer-recirc__articles").html(html);

  }
  //
  // function init() {
  // loadStories(data => {
  //   storyData = data;
  //
  //   recircHTML();
  // });
  // }

  onMount(() => {
		loadStories(data => {
			storyData = data;
			recircHTML();
		});
	});
  //
  // init();

</script>

<div class="pre-footer">
  <div class="patreon-cta">
    <p>Enjoy this project? Consider helping fund us on Patreon.</p>
    <a target="_blank" href="https://patreon.com/thepudding">
    <button type="button" name="button">Become a Patron
    </button>
    </a>
  </div>

  <div class="newsletter-cta">
    <p>You should subscribe to our newsletter too.</p>
    <form action="https://poly-graph.us11.list-manage.com/subscribe/post" method="POST">
        <input type="hidden" name="u" value="c70d3c0e372cde433143ffeab">
        <input type="hidden" name="id" value="9af100ac0f">
        <input label="email" class="newsletter__input" type="email" autocapitalize="off" autocorrect="off" name="MERGE0" id="MERGE0" size="25" value="" placeholder="you@example.com">
        <div class="hidden-from-view" style="left:-10000px;position:absolute">
          <input label="text" type="text" name="b_c70d3c0e372cde433143ffeab_9af100ac0f" tabindex="-1" value="">
        </div>
        <input class="btn" style="" type="submit" name="submit" value="Subscribe">
      </form>
  </div>
	<div class="socials">
		<p>Or follow us on <a target="_blank" href="https://www.instagram.com/the.pudding">Instagram</a>, <a target="_blank" href="https://twitter.com/puddingviz">Twitter</a>, <a target="_blank" href="https://www.facebook.com/pudding.viz">Facebook</a>, and <a href="/feed/index.xml">RSS</a>.</p>
	</div>
</div>




<footer class='pudding-footer' id="alt-footer">

	<div class='footer-recirc'>
		<p>Check out some of our other projects</p>
		<div class='footer-recirc__articles'></div>
	</div>

	<div class='footer-company'>
		<div class='footer-company__about'>
			<p class='footer-company__description'><a target="_blank" href='https://pudding.cool'>The Pudding</a> is a digital publication that explains ideas debated in culture with visual essays. Learn more about us <a href="/about">here</a>.</p>
			<p class='footer-company__trademark'>The Pudding<span>®</span> is made in Brooklyn, NY; Seattle, WA; San Antonio, TX; and Great Barrington, MA. <a target="_blank" href='https://pudding.cool/privacy/'>Our privacy policy.</a></p>
		</div>

	</div>
</footer>
