(()=>{
  const choice=new URLSearchParams(location.search).get('theme');
  const media=matchMedia('(prefers-color-scheme: dark)');
  const apply=()=>{document.documentElement.dataset.theme=choice==='dark'||choice!=='light'&&media.matches?'dark':'light';};
  apply();media.addEventListener('change',apply);
})();
