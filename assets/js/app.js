const rooms=[
{name:"VIP 1",price:20000,daily:5000,rate:25,guests:2,bed:"King Bed",size:"32 m²",img:"https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85",tags:["King bed","2 guests","32 m²"]},
{name:"VIP 2",price:40000,daily:8000,rate:20,guests:2,bed:"King Bed",size:"36 m²",img:"https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1200&q=85",tags:["King bed","2 guests","36 m²"]},
{name:"VIP 3",price:80000,daily:12000,rate:15,guests:2,bed:"King Bed",size:"42 m²",img:"https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85",tags:["King bed","2 guests","42 m²"]},
{name:"VIP 4",price:150000,daily:18000,rate:12,guests:3,bed:"King Bed",size:"48 m²",img:"https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=85",tags:["King bed","3 guests","48 m²"]},
{name:"VIP 5",price:300000,daily:30000,rate:10,guests:4,bed:"King Bed",size:"60 m²",img:"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",tags:["Suite","4 guests","60 m²"]},
{name:"VIP 6",price:500000,daily:40000,rate:8,guests:4,bed:"King Bed",size:"75 m²",img:"https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=85",tags:["Luxury suite","4 guests","75 m²"]}
];
let users=JSON.parse(localStorage.getItem("gh_users")||"[]");
let current=localStorage.getItem("gh_current");
let data=JSON.parse(localStorage.getItem("gh_data")||'{"balance":0,"history":[],"numbers":[],"team":0,"teamAmount":0}');
function money(n){return "UGX "+Number(n).toLocaleString()}
function saveData(){localStorage.setItem("gh_data",JSON.stringify(data));render()}
function toggleAuth(which){document.getElementById("loginForm").classList.toggle("hidden",which!=="login");document.getElementById("registerForm").classList.toggle("hidden",which!=="register")}
function saveProfilePhoto(event){let file=event.target.files?.[0];if(!file)return;if(!file.type.startsWith("image/"))return toast("Please choose an image");let reader=new FileReader();reader.onload=()=>{let img=new Image();img.onload=()=>{let max=420,scale=Math.min(1,max/Math.max(img.width,img.height)),w=Math.round(img.width*scale),h=Math.round(img.height*scale),c=document.createElement("canvas");c.width=w;c.height=h;let ctx=c.getContext("2d");ctx.drawImage(img,0,0,w,h);let photo=c.toDataURL("image/jpeg",.82),u=users.find(x=>x.phone===current);if(!u)return;u.photo=photo;localStorage.setItem("gh_users",JSON.stringify(users));render();toast("Profile photo updated")};img.src=reader.result};reader.readAsDataURL(file)}
function removeProfilePhoto(){let u=users.find(x=>x.phone===current);if(!u)return;u.photo="";localStorage.setItem("gh_users",JSON.stringify(users));render();toast("Profile photo removed")}
function register(){let name=document.getElementById("regName").value.trim(),phone=document.getElementById("regPhone").value.trim(),pass=document.getElementById("regPassword").value,confirm=document.getElementById("regConfirm").value;if(!name||!phone||!pass)return toast("Complete all fields");if(pass!==confirm)return toast("Passwords do not match");if(users.some(u=>u.phone===phone))return toast("Account already exists");users.push({name,phone,password:pass,photo:""});localStorage.setItem("gh_users",JSON.stringify(users));current=phone;localStorage.setItem("gh_current",phone);data={balance:0,history:[],numbers:[],team:0,teamAmount:0};localStorage.setItem("gh_data",JSON.stringify(data));openApp();showWelcome();toast("Account created")}
function login(){let phone=document.getElementById("loginPhone").value.trim(),pass=document.getElementById("loginPassword").value,u=users.find(x=>x.phone===phone&&x.password===pass);if(!u)return toast("Incorrect phone number or password");current=phone;localStorage.setItem("gh_current",phone);openApp();showWelcome()}
function logout(){localStorage.removeItem("gh_current");current=null;document.getElementById("appView").classList.add("hidden");document.getElementById("authView").classList.remove("hidden");toggleAuth("login")}
function openApp(){document.getElementById("authView").classList.add("hidden");document.getElementById("appView").classList.remove("hidden");render()}
function showPage(id){document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.page===id));scrollTo({top:0,behavior:"smooth"});render()}
function toast(msg){let t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function modal(title,body){document.getElementById("modalTitle").textContent=title;document.getElementById("modalBody").innerHTML=body;document.getElementById("modal").classList.add("show")}
function closeModal(){document.getElementById("modal").classList.remove("show")}
function openDeposit(){modal("Add Funds",'<p class="muted">Connect a secure payment provider to process real payments.</p><div class="form"><input id="amount" type="number" min="1" placeholder="Amount in UGX"><button class="btn primary" onclick="addDeposit()">Continue</button></div>')}
function addDeposit(){let a=Number(document.getElementById("amount").value);if(!a||a<1)return toast("Enter a valid amount");data.balance+=a;data.history.unshift({type:"Deposit",amount:a,status:"Completed",date:new Date().toLocaleString()});closeModal();saveData();toast("Balance updated")}
function openWithdraw(){modal("Withdraw Funds",'<p class="muted">Minimum withdrawal is UGX 5,000. A secure payment backend is required for real withdrawals.</p><div class="form"><input id="withdrawAmount" type="number" min="5000" placeholder="Amount in UGX"><button class="btn primary" onclick="withdraw()">Request Withdrawal</button></div>')}
function withdraw(){let a=Number(document.getElementById("withdrawAmount").value);if(a<5000)return toast("Minimum withdrawal is UGX 5,000");if(a>data.balance)return toast("Insufficient balance");let fee=a*.16;data.balance-=a;data.history.unshift({type:"Withdrawal",amount:a,fee,status:"Pending",date:new Date().toLocaleString()});closeModal();saveData();toast("Withdrawal request submitted")}
function saveNumber(){let phone=document.getElementById("payPhone").value.trim();if(phone.length<9)return toast("Enter a valid phone number");data.numbers.push({network:document.getElementById("network").value,phone,default:document.getElementById("defaultPay").checked});saveData();toast("Payment number saved")}
function copyLink(){navigator.clipboard?.writeText(document.getElementById("refLink").value).then(()=>toast("Invitation link copied")).catch(()=>toast("Copy unavailable"))}
function shareLink(){if(navigator.share)navigator.share({title:"Grand Horizon Hotels",text:"Join Grand Horizon Hotels",url:document.getElementById("refLink").value});else copyLink()}
function roomCard(r){
return `<article class="card room">
<img src="${r.img}" alt="${r.name}" loading="lazy">
<div class="roombody">
<div class="label">GRAND HORIZON HOTELS</div>
<h3>${r.name}</h3>
<p class="muted">${r.bed} · ${r.guests} guests · ${r.size}</p>
<div class="chips">${r.tags.map(x=>`<span class="chip">${x}</span>`).join("")}</div>
<div style="display:flex;justify-content:space-between;align-items:end;gap:8px">
<div><small class="muted">Room plan from</small><div class="price">${money(r.price)}</div></div>
<button class="btn primary" onclick='viewRoom(${JSON.stringify(r.name)})'>View room ↗</button>
</div>
</div></article>`}

function viewRoom(name){
let r=rooms.find(x=>x.name===name); if(!r)return;
let thirty=r.daily*30;
modal(r.name,`<div class="roommodal">
<img src="${r.img}" alt="${r.name}">
<div class="chips">${r.tags.map(x=>`<span class="chip">${x}</span>`).join("")}</div>
<div class="earnbox">
<div class="label">ILLUSTRATIVE DAILY RETURN</div>
<div class="earnbig">${money(r.daily)}</div>
<div class="earnrow"><span>Room price</span><b>${money(r.price)}</b></div>
<div class="earnrow"><span>Illustrative daily rate</span><b>${r.rate}%</b></div>
<div class="earnrow"><span>Illustrative 30-day total</span><b>${money(thirty)}</b></div>
</div>
<div class="notice">The figures above are projections for this website concept, not guaranteed financial returns. Any real payment or earning program must be backed by a legitimate contract, service and payment provider.</div>
<div class="btns"><button class="btn primary" onclick="rentRoom('${r.name.replace(/'/g,"\\'")}')">Rent ${r.name}</button><button class="btn" onclick="closeModal()">Close</button></div>
</div>`)
}
function rentRoom(name){closeModal();toast(name+" selected. Connect booking/payment backend to complete rental.")}

function render(){let u=users.find(x=>x.phone===current);if(!u){document.getElementById("authView").classList.remove("hidden");document.getElementById("appView").classList.add("hidden");return}document.getElementById("topName").textContent=u.name.split(" ")[0];let av=document.getElementById("avatar");av.innerHTML=u.photo?`<img src="${u.photo}" alt="Profile" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`:u.name[0].toUpperCase();let ap=document.getElementById("accountPhotoWrap");ap.innerHTML=u.photo?`<img class="profile-photo" src="${u.photo}" alt="Profile photo">`:u.name[0].toUpperCase();document.getElementById("accountName").textContent=u.name;document.getElementById("accountPhone").textContent=u.phone;["dashBalance","walletBalance","accountBalance","depositTotal"].forEach(id=>{let e=document.getElementById(id);if(e)e.textContent=money(data.balance)});document.getElementById("dashTeam").textContent=data.team;document.getElementById("teamCount").textContent=data.team;document.getElementById("teamAmount").textContent=money(data.teamAmount);document.getElementById("refLink").value=location.href.split("#")[0]+"?ref="+encodeURIComponent(current);let p=Math.min(100,data.teamAmount/50000*100);document.getElementById("teamBar").style.width=p+"%";document.getElementById("teamPercent").textContent=Math.round(p)+"%";document.getElementById("teamRemaining").textContent=p>=100?"Milestone reached":money(Math.max(0,50000-data.teamAmount))+" remaining";document.getElementById("savedNumbers").innerHTML=data.numbers.map(n=>`<div class="row"><span>${n.network} · ${n.phone}</span><small>${n.default?"DEFAULT":""}</small></div>`).join("");document.getElementById("history").innerHTML=data.history.length?data.history.map(x=>`<div class="row"><span>${x.type}<br><small class="muted">${x.date}</small></span><b>${money(x.amount)}</b></div>`).join(""):"<p class='muted'>No transactions yet.</p>";document.getElementById("featuredRooms").innerHTML=rooms.slice(0,3).map(roomCard).join("");document.getElementById("allRooms").innerHTML=rooms.map(roomCard).join("")}
if(current)openApp();else toggleAuth("login");
