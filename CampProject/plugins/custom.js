onload = () => {
  var grid = document.querySelector('#lokiPark article.row');
  var msnry = new Masonry(grid, { percentPosition: 'true' });

  // cookie 設定
  const
    aryCookie = document.cookie.split('; ');
  nodeCookie = document.querySelector('#lokiCookie');
  keywordCookie = 'cookieUsed=agree';


  if (!aryCookie.includes(keywordCookie)) {
    nodeCookie.remove();
  } else {
    nodeCookie.style.display = 'block';
    nodeCookie.querySelector('button').onclick = () => {
      // document.cookie = keywordCookie;
      now = new Date();
      now.setTime(now.getTime() + (24 * 60 * 60));
      document.cookie = `${keywordCookie}, expires=${now.toUTCString()}`;

      document.cookie = `${keywordCookie}; max-age=${60 * 60 * 24}`;
      nodeCookie.remove();
    };
  }





}