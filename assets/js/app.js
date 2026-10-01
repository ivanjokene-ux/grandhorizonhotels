const rooms = [
  {name:"VIP 1", price:20000, guests:2, bed:"King Bed", size:"32 m²", img:"https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85", tags:["King bed","2 guests","City view"]},
  {name:"VIP 2", price:40000, guests:2, bed:"King Bed", size:"36 m²", img:"https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1200&q=85", tags:["King bed","2 guests","Garden view"]},
  {name:"VIP 3", price:80000, guests:2, bed:"King Bed", size:"42 m²", img:"https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85", tags:["King bed","2 guests","Balcony"]},
  {name:"VIP 4", price:150000, guests:3, bed:"King Bed", size:"48 m²", img:"https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=85", tags:["King bed","3 guests","Family stay"]},
  {name:"VIP 5", price:300000, guests:4, bed:"King Bed", size:"60 m²", img:"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85", tags:["Suite","4 guests","Separate lounge"]},
  {name:"VIP 6", price:500000, guests:4, bed:"King Bed", size:"75 m²", img:"https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=85", tags:["Luxury suite","4 guests","Private terrace"]}
];

const money = value => "UGX " + Number(value).toLocaleString();
const encodeData = value => encodeURIComponent(String(value ?? ""));
const decodeData = value => decodeURIComponent(String(value ?? ""));

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
          <button class="btn primary" data-action="view-room" data-room="${encodeData(room.name)}">View room</button>
        </div>
      </div>
    </article>
  `;
}

function renderRooms() {
  const roomsGrid = document.getElementById("roomsGrid");
  if (!roomsGrid) return;
  roomsGrid.innerHTML = rooms.map(roomCard).join("");
}

function findRoom(name) {
  return rooms.find(item => item.name === name);
}

function viewRoom(name) {
  const room = findRoom(name);
  if (!room) return;

  modal(room.name, `
    <div class="roommodal">
      <img src="${room.img}" alt="${room.name} room">
      <div class="chips">${room.tags.map(tag => `<span class="chip">${tag}</span>`).join("")}</div>
      <p class="muted">A ${room.size} ${room.name.toLowerCase()} with a ${room.bed.toLowerCase()} and space for ${room.guests} guests.</p>
      <div class="room-price"><span>Room price</span><strong>${money(room.price)}</strong></div>
      <div class="btns">
        <button class="btn primary" data-action="open-booking" data-room="${encodeData(room.name)}">Request this room</button>
        <button class="btn" data-action="close-modal">Close</button>
      </div>
    </div>
  `);
}

function openBooking(roomName = "") {
  modal("Booking enquiry", `
    <p class="muted">Send an enquiry for your preferred room. This static site does not process payments or store passwords.</p>
    <form class="form booking-form">
      <input id="bookingName" required placeholder="Full name">
      <input id="bookingPhone" required type="tel" placeholder="Phone number">
      <select id="bookingRoom" required>
        <option value="">Select a room</option>
        ${rooms.map(room => `<option value="${escapeHtml(room.name)}" ${room.name === roomName ? "selected" : ""}>${room.name} — ${money(room.price)}</option>`).join("")}
      </select>
      <input id="bookingDate" required type="date">
      <textarea id="bookingMessage" rows="4" placeholder="Message or special request"></textarea>
      <button class="btn primary" type="submit">Prepare Enquiry</button>
    </form>
  `);
}

function submitEnquiry(event) {
  const form = event && event.target && event.target.closest ? event.target.closest(".booking-form") : null;
  if (event && typeof event.preventDefault === "function") {
    event.preventDefault();
  }

  if (!form) return;

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
    <button class="btn primary" data-action="copy-enquiry" data-copy-text="${encodeData(text)}">Copy enquiry</button>
  `);
}

function copyEnquiry(text) {
  navigator.clipboard?.writeText(text)
    .then(() => toast("Enquiry copied"))
    .catch(() => toast("Copy is unavailable in this browser"));
}

function escapeHtml(value) {
  if (value == null) return "";
  return String(value).replace(/[&<>\"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[char]));
}

function modal(title, body) {
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalRoot = document.getElementById("modal");

  if (!modalTitle || !modalBody || !modalRoot) return;

  modalTitle.textContent = title;
  modalBody.innerHTML = body;
  modalRoot.classList.add("show");
}

function closeModal() {
  const modalRoot = document.getElementById("modal");
  if (modalRoot) modalRoot.classList.remove("show");
}

function toast(message) {
  const element = document.getElementById("toast");
  if (!element) return;
  element.textContent = message;
  element.classList.add("show");
  setTimeout(() => element.classList.remove("show"), 2200);
}

function toggleMenu() {
  const siteNav = document.getElementById("siteNav");
  if (siteNav) siteNav.classList.toggle("open");
}

document.addEventListener("click", event => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const actionTarget = target.closest("[data-action]");
  if (actionTarget) {
    const action = actionTarget.getAttribute("data-action");

    switch (action) {
      case "toggle-menu":
        toggleMenu();
        break;
      case "open-booking":
        openBooking(decodeData(actionTarget.dataset.room || ""));
        break;
      case "view-room":
        viewRoom(decodeData(actionTarget.dataset.room || ""));
        break;
      case "close-modal":
        closeModal();
        break;
      case "copy-enquiry":
        copyEnquiry(decodeData(actionTarget.dataset.copyText || ""));
        break;
      default:
        break;
    }
    return;
  }

  const siteNav = document.getElementById("siteNav");
  if (siteNav && !target.closest(".site-nav") && !target.closest(".menu-button")) {
    siteNav.classList.remove("open");
  }
});

document.addEventListener("submit", event => {
  if (!(event.target instanceof Element)) return;
  const form = event.target.closest(".booking-form");
  if (form) submitEnquiry(event);
});

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
renderRooms();
