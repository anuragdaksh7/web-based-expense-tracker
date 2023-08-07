const axios = require('axios');

const url = 'http://localhost:3000'; // Replace with your server's URL and port

test('Website status code should be 200', async () => {
    const response = await axios.get(url);
  
    expect(response.status).toBe(200);
});

test('Login status code should be 200', async () => {
    const response = await axios.get(url+"/login");

    expect(response.status).toBe(200);
});