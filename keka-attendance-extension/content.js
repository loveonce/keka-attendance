(() => {

console.log("Keka Attendance Helper Loaded");

const FULL_DAY_TARGET = 8;
const HALF_DAY_TARGET = 4.5;

const SELECTORS = {
popup: ".dropdown-menu.dropdown-menu-right.dropdown-menu-logs"
};

init();

function init(){
observePopup();
}

function observePopup(){

const observer = new MutationObserver(()=>{

const popup = document.querySelector(SELECTORS.popup);

if(!popup) return;

if(popup.querySelector("#keka-attendance-helper")) return;

processAttendance(popup);

});

observer.observe(document.body,{
childList:true,
subtree:true
});

}

function processAttendance(popup){

try{

const effectiveText = getEffectiveHoursText();

if(!effectiveText) return;

const workedHours = parseEffectiveHours(effectiveText);

const targetHours = getTargetHours();

const remaining = targetHours - workedHours;

const finishTime = new Date(
Date.now() + Math.max(0,remaining) * 3600000
);

renderWidget(popup,workedHours,remaining,finishTime,targetHours);

}catch(e){
console.error("Attendance Helper Error:",e);
}

}

function getTargetHours(){

// if half day detection needed later
// can be enhanced using leave status detection

return FULL_DAY_TARGET;

}

function getEffectiveHoursText(){

const pie = document.querySelector(".pie-percent");

if(!pie) return null;

const span = pie.parentElement.querySelector("span");

if(!span) return null;

return span.textContent.trim().replace(/\s*\+\s*$/,"");

}

function parseEffectiveHours(text){

if(!text) return 0;

const hMatch = text.match(/(\d+)\s*h/i);
const mMatch = text.match(/(\d+)\s*m/i);

const hours = hMatch ? parseInt(hMatch[1]) : 0;
const minutes = mMatch ? parseInt(mMatch[1]) : 0;

return hours + minutes/60;

}

function formatHours(hours){

const h = Math.floor(hours);
const m = Math.floor((hours-h)*60);

return `${h}h ${m}m`;

}

function renderWidget(container,worked,remaining,finish,target){

const widget = document.createElement("div");

widget.id="keka-attendance-helper";

widget.style.cssText=`
margin-top:10px;
padding:10px;
background:#1b2531;
color:#fff;
font-size:14px;
line-height:1.6;
font-family:Segoe UI,Tahoma;
border-radius:6px;
`;

widget.innerHTML=`

<div>🕒 Worked: <b>${formatHours(worked)}</b></div>

<div>🎯 Target: <b>${formatHours(target)}</b></div>

<div>⏳ Remaining: <b>${
remaining<=0 ? "Completed 🎉" : formatHours(remaining)
}</b></div>

<div>🏁 Estimated Finish: <b>${
finish.toLocaleTimeString([],{
hour:'2-digit',
minute:'2-digit'
})
}</b></div>

`;

container.appendChild(widget);

}

})();
