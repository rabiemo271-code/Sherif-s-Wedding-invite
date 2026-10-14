/* =====================================================
   1) EDIT YOUR DETAILS HERE  (or use the "Edit details"
      button on the page and copy the shareable link)
   ===================================================== */
const DEFAULTS = {
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
  venue:     "G Island Hall",
  mapUrl:    "X68Q+6M9, Nile Corniche, Maadi, Cairo Governorate 4210009",                 // paste a Google Maps link to show a "View location" button
  mapText:   "View location",
  photo:     "photo.jpg",        // path or URL of the image at the bottom
  color:     "#7a1f35"           // main text color
};

/* =====================================================
   2) Everything below renders the page - no need to edit
   ===================================================== */
const FIELD_LABELS = {
  headline:"Headline", occasion:"Occasion line", name1:"First name", name2:"Second name",
  amp:"Symbol between names", weekday:"Weekday", month:"Month", day:"Day number", time:"Time",
  weddingLabel:"Wedding label", weddingDate:"Wedding date", venue:"Venue",
  mapUrl:"Map link (optional)", mapText:"Map button text", photo:"Photo path or URL", color:"Text color"
};

const $ = id => document.getElementById(id);

// Values from the URL (?name1=Ali&name2=Sara...) override defaults
function readParams(){
  const out = {}, p = new URLSearchParams(location.search);
  Object.keys(DEFAULTS).forEach(k => { if (p.has(k)) out[k] = p.get(k); });
  return out;
}
let state = { ...DEFAULTS, ...readParams() };

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

  const map = $("mapLink");
  if (state.mapUrl) { map.href = state.mapUrl; map.textContent = state.mapText; map.hidden = false; }
  else map.hidden = true;

  const photo = $("photo");
  if (state.photo) { photo.src = state.photo; photo.hidden = false; } else photo.hidden = true;

  document.documentElement.style.setProperty("--ink", state.color);
  document.title = `${state.name1} & ${state.name2} – ${state.occasion}`;
}

/* ---------- editor panel ---------- */
function buildFields(){
  const wrap = $("fields");
  wrap.innerHTML = "";
  Object.keys(DEFAULTS).forEach(key => {
    const label = document.createElement("label");
    label.textContent = FIELD_LABELS[key];
    const input = document.createElement("input");
    input.type = key === "color" ? "color" : "text";
    input.value = state[key];
    input.dataset.key = key;
    input.addEventListener("input", () => { state[key] = input.value; render(); });
    label.appendChild(input);
    wrap.appendChild(label);
  });
}

function shareLink(){
  const p = new URLSearchParams();
  Object.keys(DEFAULTS).forEach(k => { if (state[k] !== DEFAULTS[k]) p.set(k, state[k]); });
  const q = p.toString();
  return location.origin === "null" || location.protocol === "file:"
    ? location.href.split("?")[0] + (q ? "?" + q : "")
    : location.origin + location.pathname + (q ? "?" + q : "");
}

const panel = $("panel"), hint = $("hint");
$("editToggle").addEventListener("click", () => { panel.hidden = false; buildFields(); });
$("closePanel").addEventListener("click", () => { panel.hidden = true; });
$("resetBtn").addEventListener("click", () => {
  state = { ...DEFAULTS }; render(); buildFields(); history.replaceState(null, "", location.pathname);
  hint.textContent = "Back to the original details.";
});
$("copyLink").addEventListener("click", async () => {
  const link = shareLink();
  try { await navigator.clipboard.writeText(link); hint.textContent = "Link copied. Send it to your guests."; }
  catch { hint.textContent = link; }
});

// Hide the edit button for guests: open the page with ?guest=1
if (new URLSearchParams(location.search).has("guest")) $("editToggle").hidden = true;

render();
