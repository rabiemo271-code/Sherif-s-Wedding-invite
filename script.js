/* =====================================================
   1) EDIT YOUR DETAILS HERE  (or use the "Edit details"
      button on the page and copy the shareable link)
   ===================================================== */
const DEFAULTS = {
  /* invitation text */
  headline:  "Join Us",
  occasion:  "For the engagement of",
  name1:     "Sherif",
  name2:     "Amira",
  amp:       "&",
  weekday:   "Friday",
  month:     "April",
  day:       "26",
  time:      "8:30 PM",
  weddingLabel: "Wedding:",
  weddingDate:  "26/11/2026",
  venue:     "G islan - maddi",
  mapUrl:    "",                 // paste a Google Maps link to show a location button
  mapText:   "View location",
  photo:     "photo.jpg",        // path or URL of the image at the bottom
  color:     "#7a1f35",          // main text color

  /* personal guest name (use ?to=Ahmed in the link) */
  to:        "",
  toLabel:   "Dear",

  /* envelope intro */
  envelope:  "yes",              // "yes" or "no"
  openHint:  "Tap to open",
  sealText:  "",                 // empty = initials of the two names
  sealColor: "#7a1f35",
  envColor:  "#f4f3f1"
};

/* =====================================================
   2) Everything below runs the page - no need to edit
   ===================================================== */
const FIELD_LABELS = {
  headline:"Headline", occasion:"Occasion line", name1:"First name", name2:"Second name",
  amp:"Symbol between names", weekday:"Weekday", month:"Month", day:"Day number", time:"Time",
  weddingLabel:"Wedding label", weddingDate:"Wedding date", venue:"Venue",
  mapUrl:"Map link (optional)", mapText:"Map button text", photo:"Photo path or URL", color:"Text color",
  to:"Guest name (optional)", toLabel:"Guest greeting word",
  envelope:"Show envelope intro", openHint:"Envelope hint text",
  sealText:"Seal text (empty = initials)", sealColor:"Seal color", envColor:"Envelope color"
};
const FIELD_TYPES = {
  color:"color", sealColor:"color", envColor:"color", envelope:["yes","no"]
};

const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);

let state = { ...DEFAULTS };
Object.keys(DEFAULTS).forEach(k => { if (params.has(k)) state[k] = params.get(k); });

const ARABIC = /[\u0600-\u06FF]/;
const TEXT_IDS = ["headline","occasion","name1","name2","amp","weekday","month","day","time","weddingLine","venue","dear","envTo","openHint"];

function render(){
  $("headline").textContent = state.headline;
  $("occasion").textContent = state.occasion;
  $("name1").textContent = state.name1;
  $("name2").textContent = state.name2;
  $("amp").textContent = state.amp;
  $("weekday").textContent = state.weekday;
  $("month").textContent = state.month;
  $("day").textContent = state.day;
  $("time").textContent = state.time;
  $("weddingLine").textContent = [state.weddingLabel, state.weddingDate].filter(Boolean).join(" ");
  $("venue").textContent = state.venue;

  const greet = state.to ? `${state.toLabel} ${state.to}`.trim() : "";
  $("dear").textContent = greet; $("dear").hidden = !greet;
  $("envTo").textContent = greet; $("envTo").hidden = !greet;

  const map = $("mapLink");
  if (state.mapUrl) { map.href = state.mapUrl; map.textContent = state.mapText; map.hidden = false; }
  else map.hidden = true;

  const photo = $("photo");
  if (state.photo) { if (photo.getAttribute("src") !== state.photo) photo.src = state.photo; photo.hidden = false; }
  else photo.hidden = true;

  const initials = (state.name1.trim()[0] || "") + (state.name2.trim() ? "&" + state.name2.trim()[0] : "");
  $("sealText").textContent = state.sealText || initials.toUpperCase();
  $("openHint").textContent = state.openHint;

  const root = document.documentElement.style;
  root.setProperty("--ink", state.color);
  root.setProperty("--seal", state.sealColor);
  root.setProperty("--env", state.envColor);

  document.body.classList.toggle("rtl-text", TEXT_IDS.some(id => ARABIC.test($(id).textContent)));
  document.title = `${state.name1} & ${state.name2} – ${state.occasion}`;
}

/* ---------- envelope ---------- */
const env = $("envelope");
let openTimers = [];

function showContentNow(){
  env.hidden = true;
  document.body.classList.remove("locked");
  document.body.classList.add("revealed");
}

function openEnvelope(){
  if (env.classList.contains("opening")) return;
  env.classList.add("opening");                      // 1) seal melts away
  openTimers.push(setTimeout(() => {                 // 2) halves slide apart
    env.classList.add("open");
    document.body.classList.add("revealed");         // 3) invitation rises in
  }, 700));
  openTimers.push(setTimeout(() => {                 // 4) clean up
    env.hidden = true;
    document.body.classList.remove("locked");
  }, 700 + 1500));
}

function resetEnvelope(){
  openTimers.forEach(clearTimeout); openTimers = [];
  env.classList.remove("opening","open");
  env.hidden = false;
  document.body.classList.add("locked");
  document.body.classList.remove("revealed");
  window.scrollTo(0, 0);
}

env.addEventListener("click", openEnvelope);
$("sealBtn").addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); } });

/* ---------- editor panel ---------- */
function buildFields(){
  const wrap = $("fields");
  wrap.innerHTML = "";
  Object.keys(DEFAULTS).forEach(key => {
    const label = document.createElement("label");
    label.textContent = FIELD_LABELS[key];
    const type = FIELD_TYPES[key];
    let input;
    if (Array.isArray(type)) {
      input = document.createElement("select");
      type.forEach(v => { const o = document.createElement("option"); o.value = o.textContent = v; input.appendChild(o); });
    } else {
      input = document.createElement("input");
      input.type = type || "text";
    }
    input.value = state[key];
    input.addEventListener("input", () => { state[key] = input.value; render(); });
    label.appendChild(input);
    wrap.appendChild(label);
  });
}

function shareLink(){
  const p = new URLSearchParams();
  Object.keys(DEFAULTS).forEach(k => { if (state[k] !== DEFAULTS[k]) p.set(k, state[k]); });
  const q = p.toString();
  return location.href.split("?")[0].split("#")[0] + (q ? "?" + q : "");
}

const panel = $("panel"), hint = $("hint");
$("editToggle").addEventListener("click", () => { panel.hidden = false; buildFields(); });
$("closePanel").addEventListener("click", () => { panel.hidden = true; });
$("replayBtn").addEventListener("click", () => { panel.hidden = true; if (state.envelope !== "no") resetEnvelope(); });
$("resetBtn").addEventListener("click", () => {
  state = { ...DEFAULTS }; render(); buildFields();
  history.replaceState(null, "", location.pathname);
  hint.textContent = "Back to the original details.";
});
$("copyLink").addEventListener("click", async () => {
  const link = shareLink();
  try { await navigator.clipboard.writeText(link); hint.textContent = "Link copied. Add &guest=1 to hide the edit button, and &to=Name for a personal greeting."; }
  catch { hint.textContent = link; }
});

// Hide the edit button for guests: open the page with ?guest=1
if (params.has("guest")) $("editToggle").hidden = true;

/* ---------- start ---------- */
render();
if (state.envelope === "no") showContentNow();
