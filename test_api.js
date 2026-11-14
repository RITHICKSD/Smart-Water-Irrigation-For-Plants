fetch('http://localhost:3000/api/sensors', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    soilMoisture: 88,
    temperature: 15,
    humidity: 50,
    light: 800,
    rainDetected: true
  })
}).then(res => res.json()).then(console.log).catch(console.error);
