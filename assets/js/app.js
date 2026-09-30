const rooms = [
  {name:"VIP 1", price:20000, guests:2, bed:"King Bed", size:"32 m²", img:"https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85", tags:["King bed","2 guests","32 m²"]},
  {name:"VIP 2", price:40000, guests:2, bed:"King Bed", size:"36 m²", img:"https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1200&q=85", tags:["King bed","2 guests","36 m²"]},
  {name:"VIP 3", price:80000, guests:2, bed:"King Bed", size:"42 m²", img:"https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85", tags:["King bed","2 guests","42 m²"]},
  {name:"VIP 4", price:150000, guests:3, bed:"King Bed", size:"48 m²", img:"https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=85", tags:["King bed","3 guests","48 m²"]},
  {name:"VIP 5", price:300000, guests:4, bed:"King Bed", size:"60 m²", img:"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85", tags:["Suite","4 guests","60 m²"]},
  {name:"VIP 6", price:500000, guests:4, bed:"King Bed", size:"75 m²", img:"https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=85", tags:["Luxury suite","4 guests","75 m²"]}
];

const money = value => "UGX " + Number(value).toLocaleString();

function roomCard(room) {
  return `
    <article class="card room">
      <img src="${room.img}" alt="${room.name} room" loading="lazy">
      <div class="roombody">
        <div class="label">GRAND HORIZON HOTELS</div>
        <h3>${room.name}</h3>
        <p class="muted">${room.bed} · ${room.guests} guests · ${room.size}</p>
        <div class="chips">${room.tags.map(tag => `<span class="chip">${tag}</span>`).join("")}</div>
        <div class="room-footer">
          <div><small class="muted">Room price</small><div class="price">${money(room.price)}</div></div>
          <button class="btn primary" onclick="viewRoom('${room.name}')">View room</button>
        </div>
      </div>
    </article>
  `;
}

function renderRooms() {
  document.getElementById("roomsGrid").innerHTML = rooms.map(roomCard).join("");
}

function viewRoom(name) {
  const room = rooms.find(item => item.name === name);
  if (!room) return;

  modal(room.name, `
    <div class="roommodal">
      <img src="${room.img}" alt="${room.name} room">
      <div class="chips">${room.tags.map(tag => `<span class="chip">${tag}</span>`).join("")}</div>
      <p class="muted">A ${room.size} ${room.name.toLowerCase()} with a ${room.bed.toLowerCase()} and space for ${room.guests} guests.</p>
      <div class="room-price"><span>Room price</span><strong>${money(room.price)}</strong></div>
      <div class="btns">
        <button class="btn primary" onclick="openBooking('${room.name}')">Request this room</button>
        <button class="btn" onclick="closeModal()">Close</button>
      </div>
    </div>
  `);
}

function openBooking(roomName = "") {
  modal("Booking enquiry", `
    <p class="muted">Send an enquiry for your preferred room. This static site does not process payments or store passwords.</p>
    <form class="form" onsubmit="submitEnquiry(event)">
      <input id="bookingName" required placeholder="Full name">
      <input id="bookingPhone" required type="tel" placeholder="Phone number">
      <select id="bookingRoom" required>
        <option value="">Select a room</option>
        ${rooms.map(room => `<option value="${room.name}" ${room.name === roomName ? "selected" : ""}>${room.name} — ${money(room.price)}</option>`).join("")}
      </select>
      <input id="bookingDate" required type="date">
      <textarea id="bookingMessage" rows="4" placeholder="Message or special request"></textarea>
      <button class="btn primary" type="submit">Prepare Enquiry</button>
    </form>
  `);
}

function submitEnquiry(event) {
  event.preventDefault();
  const name = document.getElementById("bookingName").value.trim();
  const phone = document.getElementById("bookingPhone").value.trim();
  const room = document.getElementById("bookingRoom").value;
  const date = document.getElementById("bookingDate").value;
  const message = document.getElementById("bookingMessage").value.trim();

  const text = [
    "Grand Horizon Hotels booking enquiry",
    "Name: " + name,
    "Phone: " + phone,
    "Room: " + room,
    "Preferred date: " + date,
    message ? "Message: " + message : ""
  ].filter(Boolean).join("\n");

  closeModal();
  modal("Enquiry ready", `
    <p>Your enquiry has been prepared. Connect this form to the hotel's email, WhatsApp or booking backend to send it automatically.</p>
    <pre class="enquiry">${escapeHtml(text)}</pre>
    <button class="btn primary" onclick="copyEnquiry(${JSON.stringify(text)})">Copy enquiry</button>
  `);
}

function copyEnquiry(text) {
  navigator.clipboard?.writeText(text)
    .then(() => toast("Enquiry copied"))
    .catch(() => toast("Copy is unavailable in this browser"));
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[char]));
}

function modal(title, body) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalBody").innerHTML = body;
  document.getElementById("modal").classList.add("show");
}

function closeModal() {
  document.getElementById("modal").classList.remove("show");
}

function toast(message) {
  const element = document.getElementById("toast");
  element.textContent = message;
  element.classList.add("show");
  setTimeout(() => element.classList.remove("show"), 2200);
}

function toggleMenu() {
  document.getElementById("siteNav").classList.toggle("open");
}

document.addEventListener("click", event => {
  if (!event.target.closest(".site-nav") && !event.target.closest(".menu-button")) {
    document.getElementById("siteNav").classList.remove("open");
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
renderRooms();
