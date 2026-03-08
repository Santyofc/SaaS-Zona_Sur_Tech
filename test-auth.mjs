const testAuth = async () => {
  try {
    console.log('Testing Register...');
    const regRes = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test_zst3@example.com', password: 'SecurePass123!', name: 'Test ZST' })
    });
    console.log('Register Status:', regRes.status);
    const regData = await regRes.json();
    console.log('Register Response:', regData);

    console.log('\nTesting Login...');
    const loginRes = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test_zst3@example.com', password: 'SecurePass123!' })
    });
    console.log('Login Status:', loginRes.status);
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData);
    
    // Test ME
    const cookies = loginRes.headers.get('set-cookie');
    console.log('\nTesting Me endpoint with cookies: ', cookies);
    const meRes = await fetch('http://localhost:3001/api/auth/me', {
      headers: cookies ? { 'cookie': cookies } : {}
    });
    console.log('Me Status:', meRes.status);
    const meData = await meRes.json();
    console.log('Me Response:', meData);

  } catch (err) {
    console.error(err);
  }
};
testAuth();
