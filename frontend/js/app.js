const authMessage = document.getElementById('authMessage');
const bookingMessage = document.getElementById('bookingMessage');
const vehicleList = document.getElementById('vehicleList');
const dashboardOutput = document.getElementById('dashboardOutput');
const finalBookingsOutput = document.getElementById('finalBookingsOutput');

const renderVehicles = (vehicles) => {
  if (!vehicles.length) {
    vehicleList.innerHTML = '<p>No vehicles available.</p>';
    return;
  }

  vehicleList.innerHTML = vehicles
    .map(
      (v) => `
      <article class="vehicle-card">
        <h3>${v.vehicle_name}</h3>
        <p>#${v.vehicle_id} • ${v.vehicle_number}</p>
        <p>${v.category} • ${v.transmission} • ${v.seating_capacity} seats</p>
        <p>₹${v.rental_price_per_day}/day</p>
        <p>${v.branch_name}, ${v.city}</p>
        <p class="${v.availability_status === 'Available' ? 'available' : 'booked'}">${v.availability_status}</p>
      </article>
    `
    )
    .join('');
};

const loadVehicles = async () => {
  try {
    const category = document.getElementById('categoryFilter').value;
    const vehicles = await window.vrsApi.getAvailableVehicles(category);
    renderVehicles(vehicles);
  } catch (error) {
    vehicleList.innerHTML = `<p>${error.message}</p>`;
  }
};

document.getElementById('registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(event.target).entries());
  try {
    const result = await window.vrsApi.register(formData);
    localStorage.setItem('vrs_token', result.token);
    authMessage.textContent = 'Registered and logged in successfully.';
  } catch (error) {
    authMessage.textContent = error.message;
  }
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(event.target).entries());
  try {
    const result = await window.vrsApi.login(formData);
    localStorage.setItem('vrs_token', result.token);
    authMessage.textContent = 'Logged in successfully.';
  } catch (error) {
    authMessage.textContent = error.message;
  }
});

document.getElementById('bookingForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(event.target).entries());
  try {
    await window.vrsApi.bookVehicle(formData);
    bookingMessage.textContent = 'Booking created successfully.';
    loadVehicles();
  } catch (error) {
    bookingMessage.textContent = error.message;
  }
});

document.getElementById('cancelForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(event.target).entries());
  try {
    await window.vrsApi.cancelBooking(formData.booking_id, { reason: formData.reason });
    bookingMessage.textContent = 'Booking cancelled successfully.';
    loadVehicles();
  } catch (error) {
    bookingMessage.textContent = error.message;
  }
});

document.getElementById('modifyForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(event.target).entries());
  try {
    await window.vrsApi.modifyBooking(formData.booking_id, {
      new_start_date: formData.new_start_date,
      new_end_date: formData.new_end_date,
      reason: formData.reason
    });
    bookingMessage.textContent = 'Booking modified successfully.';
  } catch (error) {
    bookingMessage.textContent = error.message;
  }
});

document.getElementById('loadDashboard').addEventListener('click', async () => {
  try {
    const data = await window.vrsApi.getDashboard();
    dashboardOutput.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    dashboardOutput.textContent = error.message;
  }
});

document.getElementById('loadFinalBookings').addEventListener('click', async () => {
  try {
    const data = await window.vrsApi.getFinalBookings();
    finalBookingsOutput.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    finalBookingsOutput.textContent = error.message;
  }
});

document.getElementById('refreshVehicles').addEventListener('click', loadVehicles);
loadVehicles();
