import fetch from 'node-fetch';
import express from 'express';

const app = express();
const port = 3000;

const lat=49.8349139
const lng=18.2820084

const getData = async () => {
    const daylight = await new Promise(resolve => {
        fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}`)
            .then(result => resolve(result.json()))
            .catch(error => resolve({
                results: { sunrise: '06:00:00 AM', sunset: '06:00:00 PM'}
            }));
    });
    
    const sunriseParsed = [ ...daylight.results.sunrise.matchAll(/\d+/g) ];
    const sunrise = new Date();
    sunrise.setUTCHours(sunriseParsed[0]);
    sunrise.setUTCMinutes(sunriseParsed[1]);
    sunrise.setUTCSeconds(sunriseParsed[2]);

    const sunsetParsed = [ ...daylight.results.sunset.matchAll(/\d+/g) ];
    const sunset = new Date();
    sunset.setUTCHours(parseInt(sunsetParsed[0]) + 12);
    sunset.setUTCMinutes(sunsetParsed[1]);
    sunset.setUTCSeconds(sunsetParsed[2]);
    
    return {
        time: new Date(Date.now()).toLocaleString('cs-CZ'),
        sunrise: sunrise.toLocaleString('cs-CZ'),
        sunset: sunset.toLocaleString('cs-CZ'),
        sunlightNow: Date.now() > sunrise && Date.now() < sunset,
    };
}

app.get('/', async (request, response) => {
    const result = await getData();
    
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(result));
    response.end();
});

app.get('/text', async(request, response) => {
    const result = await getData();
    
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write(`time=${result.time},sunrise=${result.sunrise},sunset=${result.sunset},sunlightNow=${sunlightNow}`);
    response.end();
});

app.get('/sunlightnow', async(request, response) => {
    const result = await getData();

    response.writeHead(200, { 'Content-type': 'text/plain' });
    response.write(`${result.sunlightNow}`);
    response.end();
});

app.listen(port, () => { console.log(`Server is listening on ${port}`) });