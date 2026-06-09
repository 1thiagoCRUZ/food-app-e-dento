async function test() {
  const API = 'https://app-food-backend-vqrm.onrender.com';
  
  // Register a restaurant user
  const email = `test${Date.now()}@test.com`;
  let res = await fetch(`${API}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test', email, password: 'password123', cpf: '123.456.789-00', phone: '11999999999', role: 'RESTAURANT'
    })
  });
  console.log('Register user:', await res.text());

  // Login
  res = await fetch(`${API}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123' })
  });
  const loginData = await res.json();
  const token = loginData.access_token;
  console.log('Login:', loginData);

  // Register restaurant
  res = await fetch(`${API}/restaurants`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test Rest', cnpj: '12.345.678/0001-90', isOpen: true })
  });
  const restData = await res.json();
  console.log('Register rest:', restData);

  // Fetch orders
  const restId = restData.id;
  res = await fetch(`${API}/orders/restaurant/${restId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Orders status:', res.status);
  console.log('Orders:', await res.text());
}
test();
