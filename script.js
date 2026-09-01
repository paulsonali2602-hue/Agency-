const body=document.body;
const nav=document.getElementById("nav");
const themeToggle=document.getElementById("themeToggle");
const mobileMenu=document.getElementById("mobileMenu");
const navLinks=document.getElementById("navLinks");

const savedTheme=localStorage.getItem("cba-theme");
if(savedTheme==="light") body.classList.add("light");

themeToggle.addEventListener("click",()=>{
  body.classList.toggle("light");
  localStorage.setItem("cba-theme",body.classList.contains("light")?"light":"dark");
});

window.addEventListener("scroll",()=>nav.classList.toggle("scrolled",scrollY>30));

mobileMenu.addEventListener("click",()=>{
  const open=navLinks.classList.toggle("open");
  mobileMenu.setAttribute("aria-expanded",open);
});
navLinks.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>navLinks.classList.remove("open")));

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}});
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

/* Demo chatbot */
const messages=document.getElementById("demoMessages");
document.getElementById("quickReplies").addEventListener("click",e=>{
  if(!e.target.matches("button")) return;
  const reply=e.target.dataset.reply;
  const user=document.createElement("div");
  user.className="demo-msg user"; user.textContent=reply; messages.appendChild(user);
  const bot=document.createElement("div"); bot.className="demo-msg"; bot.textContent="Great choice. I can help you map that out. Want to book a free consultation?";
  setTimeout(()=>messages.appendChild(bot),500);
});

/* Booking calendar */
const calendarDays=document.getElementById("calendarDays");
const monthLabel=document.getElementById("monthLabel");
const prevMonth=document.getElementById("prevMonth");
const nextMonth=document.getElementById("nextMonth");
const timeGrid=document.getElementById("timeGrid");
let current=new Date(); current.setHours(0,0,0,0);
let selectedDate=null, selectedTime=null;

function renderCalendar(){
  const y=current.getFullYear(), m=current.getMonth();
  monthLabel.textContent=new Intl.DateTimeFormat("en",{month:"long",year:"numeric"}).format(current);
  calendarDays.innerHTML="";
  const first=new Date(y,m,1).getDay();
  const count=new Date(y,m+1,0).getDate();
  const prevCount=new Date(y,m,0).getDate();
  for(let i=0;i<first;i++){
    const b=document.createElement("button"); b.className="muted"; b.textContent=prevCount-first+i+1; b.disabled=true; calendarDays.appendChild(b);
  }
  for(let d=1;d<=count;d++){
    const date=new Date(y,m,d);
    const b=document.createElement("button"); b.textContent=d;
    if(date<new Date(new Date().setHours(0,0,0,0))) b.classList.add("muted");
    if(selectedDate && date.toDateString()===selectedDate.toDateString()) b.classList.add("selected");
    b.addEventListener("click",()=>{selectedDate=date;renderCalendar()});
    calendarDays.appendChild(b);
  }
}
prevMonth.onclick=()=>{current.setMonth(current.getMonth()-1);renderCalendar()};
nextMonth.onclick=()=>{current.setMonth(current.getMonth()+1);renderCalendar()};
timeGrid.addEventListener("click",e=>{
  if(e.target.tagName!=="BUTTON")return;
  timeGrid.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));
  e.target.classList.add("selected"); selectedTime=e.target.textContent;
});
renderCalendar();

/* Booking submit: demo front-end confirmation */
document.getElementById("bookingForm").addEventListener("submit",e=>{
  e.preventDefault();
  if(!selectedDate){alert("Please select an available date.");return}
  if(!selectedTime){alert("Please select an available time.");return}
  document.getElementById("bookingFormView").style.display="none";
  document.getElementById("bookingSuccess").classList.add("show");
});
document.getElementById("resetBooking").addEventListener("click",()=>{
  document.getElementById("bookingForm").reset();
  selectedDate=null; selectedTime=null; timeGrid.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));
  renderCalendar();
  document.getElementById("bookingSuccess").classList.remove("show");
  document.getElementById("bookingFormView").style.display="block";
});

/* Smooth anchor fallback for browsers/webviews */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",e=>{
    const target=document.querySelector(a.getAttribute("href"));
    if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth",block:"start"});}
  });
});
