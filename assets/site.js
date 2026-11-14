'use strict';
(() => {
 const T={
 ru:{navProjects:"Проекты",navAbout:"О коллекции",eyebrow:"ОБРАЗОВАНИЕ · НАУКА · ИССЛЕДОВАНИЕ",heroTitle:"Исследуй.|Изучай.|Создавай.",heroDesc:"Независимые интерактивные инструменты для обучения, научных исследований и визуального мышления. Открывай прямо в браузере.",browse:"Исследовать проекты ↗",profile:"GitHub автора ↗",projectsWord:"проектов",availability:"Бесплатные проекты",projectsTitle:"Библиотека приложений",projectsDesc:"Каждый проект — самостоятельный инструмент для работы и исследования.",search:"Найти приложение, тему, технологию…",all:"Все",learning:"Обучение",visualization:"Визуализация",research:"Наука",matches:"найдено",run:"Открыть приложение ↗",repo:"Репозиторий ↗",download:"Скачать HTML ↓",downloadArchive:"Скачать проект ZIP ↓",details:"Подробнее →",online:"Доступен онлайн",sourceOnly:"Доступны файлы проекта",empty:"Ничего не найдено. Измени запрос или фильтр.",aboutTitle:"Создано для исследования.|Открыто для изучения.",aboutDesc:"Одни приложения можно запустить сразу; для других пока доступен публичный репозиторий. Мы различаем эти состояния, чтобы не обещать несуществующие онлайн-демо.",about1:"Настоящие инструменты",about1desc:"Практические тренажёры, симуляторы и исследовательские интерфейсы.",about2:"Прозрачность",about2desc:"Отдельные ссылки на запущенное приложение и репозиторий исходников.",about3:"Развитие",about3desc:"Версии, проверки и новые приложения без потери старых проектов.",footDesc:"Независимые образовательные и научные веб-проекты.",legal:"Этот сайт не собирает учётные данные и не использует аналитику. У сторонних проектов могут быть отдельные условия."},
 en:{navProjects:"Projects",navAbout:"About",eyebrow:"EDUCATION · SCIENCE · EXPLORATION",heroTitle:"Explore.|Learn.|Create.",heroDesc:"Independent interactive tools for learning, research and visual thinking. Discover ideas directly in the browser.",browse:"Explore projects ↗",profile:"Author on GitHub ↗",projectsWord:"projects",availability:"Free projects",projectsTitle:"Application library",projectsDesc:"Each project is a self-contained instrument for work and exploration.",search:"Find an app, subject or technology…",all:"All",learning:"Learning",visualization:"Visualization",research:"Research",matches:"found",run:"Launch application ↗",repo:"Source repository ↗",download:"Download HTML ↓",downloadArchive:"Source ZIP ↓",details:"Details →",online:"Online app",sourceOnly:"Repository available",empty:"No matching projects. Change your search or filter.",aboutTitle:"Built for exploration.|Open to discovery.",aboutDesc:"Some apps can be launched now; others currently have a public repository only. We distinguish those states rather than promising unavailable live demos.",about1:"Real instruments",about1desc:"Hands-on trainers, simulators and scientific interfaces.",about2:"Transparency",about2desc:"Separate links for working demos and source repositories.",about3:"Built to evolve",about3desc:"Versions, checks and new applications while preserving older work.",footDesc:"Independent educational and scientific web projects.",legal:"This catalog does not collect user accounts or use analytics. Linked projects may have separate policies."},
 de:{navProjects:"Projekte",navAbout:"Über uns",eyebrow:"BILDUNG · WISSENSCHAFT · ENTDECKUNG",heroTitle:"Erforschen.|Lernen.|Gestalten.",heroDesc:"Unabhängige interaktive Werkzeuge für Lernen, Forschung und visuelles Denken. Neue Ideen direkt im Browser entdecken.",browse:"Projekte entdecken ↗",profile:"Autor auf GitHub ↗",projectsWord:"Projekte",availability:"Kostenlose Projekte",projectsTitle:"Anwendungsbibliothek",projectsDesc:"Jedes Projekt ist ein eigenständiges Werkzeug zum Arbeiten und Entdecken.",search:"Anwendung, Thema oder Technologie suchen…",all:"Alle",learning:"Lernen",visualization:"Visualisierung",research:"Forschung",matches:"gefunden",run:"Anwendung starten ↗",repo:"Repository ansehen ↗",download:"HTML herunterladen ↓",downloadArchive:"Projekt-ZIP ↓",details:"Details →",online:"Online verfügbar",sourceOnly:"Repository verfügbar",empty:"Keine passenden Projekte. Suche oder Filter ändern.",aboutTitle:"Für die Forschung entwickelt.|Offen für Entdeckungen.",aboutDesc:"Einige Anwendungen können direkt gestartet werden; bei anderen ist bisher nur das öffentliche Repository verfügbar. Wir unterscheiden diese Zustände.",about1:"Echte Werkzeuge",about1desc:"Praktische Trainer, Simulatoren und Forschungsoberflächen.",about2:"Transparenz",about2desc:"Getrennte Links für funktionierende Demos und Quellcode-Repositories.",about3:"Kontinuierliche Entwicklung",about3desc:"Versionen, Tests und neue Anwendungen bei Erhaltung älterer Projekte.",footDesc:"Unabhängige Bildungs- und Wissenschaftsprojekte.",legal:"Dieser Katalog erhebt keine Benutzerkonten und verwendet keine Analysedienste. Verlinkte Projekte haben möglicherweise eigene Regeln."}
 };
 const embedded=document.getElementById("embedded-catalog");
 let data;
 try{data=JSON.parse(embedded.textContent)}catch{data={projects:[]}}
 const cards=document.getElementById("cards"),search=document.getElementById("search"),filters=document.getElementById("filters"),theme=document.getElementById("theme");
 const browserLang=(((navigator.languages||[]).concat(navigator.language||"en")).map(x=>String(x).split("-")[0].toLowerCase()).find(x=>T[x]))||"en";
 let lang=browserLang,category="all",term="";
 try{lang=localStorage.getItem("app-atlas-language")||lang;const savedTheme=localStorage.getItem("app-atlas-theme");if(savedTheme==="light"||savedTheme==="dark")document.documentElement.dataset.theme=savedTheme;}catch{}
 if(!T[lang])lang=browserLang;
 const elt=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=value;return n};
 const safeLocal=(value)=>typeof value==="string"&&/^\.\/[a-zA-Z0-9/_\-.]+$/.test(value);
 const safeExternal=(value)=>typeof value==="string"&&/^https:\/\/github\.com\/4vmp5pkwz4-pixel\/[a-zA-Z0-9._-]+$/.test(value);
 const safeHosted=(value)=>typeof value==="string"&&/^https:\/\/4vmp5pkwz4-pixel\.github\.io\/[A-Za-z0-9._-]+\/$/.test(value);
 const safeArchive=(value)=>typeof value==="string"&&/^https:\/\/github\.com\/4vmp5pkwz4-pixel\/[A-Za-z0-9._-]+\/archive\/refs\/heads\/[A-Za-z0-9._/-]+\.zip$/.test(value);
 const available=(value)=>safeLocal(value)||safeHosted(value);
 function link(href,label,cls,download){
  const a=elt("a",cls,label);a.href=href;
  if(download){a.setAttribute("download",download)}else if(href.startsWith("https://")){a.target="_blank";a.rel="noopener noreferrer"}
  return a;
 }
 function humanTitle(s){
  const [a,b,c]=(s||"").split("|");const frag=document.createDocumentFragment();
  frag.append(document.createTextNode(a||""));frag.append(document.createElement("br"));const em=document.createElement("em");em.textContent=b||"";frag.append(em);if(c){frag.append(document.createTextNode(" "+c))}
  return frag;
 }
 function render(){
  const t=T[lang];document.documentElement.lang=lang;
  for(const node of document.querySelectorAll("[data-i]")){
   const id=node.getAttribute("data-i");
   if(id==="heroTitle"||id==="aboutTitle"){node.replaceChildren(humanTitle(t[id]));continue}
   if(t[id])node.textContent=t[id];
  }
  document.getElementById("heroCount").textContent=data.projects.length;
  search.placeholder=t.search;search.setAttribute("aria-label",t.search);
  document.querySelectorAll("[data-lang]").forEach(b=>b.setAttribute("aria-pressed",String(lang===b.dataset.lang)));
  filters.replaceChildren();
  for(const key of ["all","learning","visualization","research"]){
   const b=elt("button","",t[key]);b.type="button";b.setAttribute("aria-pressed",String(category===key));b.addEventListener("click",()=>{category=key;render()});filters.append(b);
  }
  const list=data.projects.filter(p=>(category==="all"||p.category===category)&&[p.name,p.desc?.[lang]||p.desc?.en,...(p.tags||[])].join(" ").toLocaleLowerCase().includes(term.toLocaleLowerCase()));
  document.getElementById("resultCount").textContent=list.length+" "+t.matches;
  cards.replaceChildren();
  document.getElementById("empty").hidden=list.length>0;document.getElementById("empty").textContent=t.empty;
  for(const p of list){
   const card=elt("article","tile"),visual=elt("div","tile-top "+p.category);
   visual.append(elt("span","label",p.featured?"FEATURED":p.category.toUpperCase()));
   const symbol=elt("span","tile-symbol",p.mark||"◇");visual.append(symbol);
   const body=elt("div","tile-body");
   body.append(elt("span","smallcaps",t[p.category]||p.category),elt("h3","",p.name),elt("p","",p.desc?.[lang]||p.desc?.en||""));
   const tags=elt("div","tags");for(const tag of p.tags||[])tags.append(elt("span","tag",tag));body.append(tags);
   const actions=elt("div","tile-actions");
   if(available(p.url))actions.append(link(p.url,t.run,"primary"));
   if(safeExternal(p.source))actions.append(link(p.source,t.repo,available(p.url)?"":"primary"));
   if(safeLocal(p.download))actions.append(link(p.download,t.download,"",p.id+".html"));
   if(safeArchive(p.downloadArchive))actions.append(link(p.downloadArchive,t.downloadArchive,""));
   actions.append(link("./projects/"+p.id+"/",t.details,""));
   body.append(actions,elt("div","tile-status",available(p.url)?"● "+t.online:"○ "+t.sourceOnly));
   card.append(visual,body);cards.append(card);
  }
 }
 document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>{lang=b.dataset.lang;try{localStorage.setItem("app-atlas-language",lang)}catch{}render()}));
 search.addEventListener("input",()=>{term=search.value.trim();render()});
 document.addEventListener("keydown",e=>{if(e.key==="/"&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&document.activeElement!==search&&!["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)){e.preventDefault();search.focus()}});
 theme.addEventListener("click",()=>{const next=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=next;try{localStorage.setItem("app-atlas-theme",next)}catch{}});
 render();
 if(location.protocol!=="file:")fetch("./catalog.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("Catalog unavailable");return r.json()}).then(result=>{if(result?.schemaVersion===1&&Array.isArray(result.projects))data=result;render()}).catch(()=>{});
})();
