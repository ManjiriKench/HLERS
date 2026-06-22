const { Client } = require('@googlemaps/google-maps-services-js');
const mapsClient = new Client({});

const getETA = async(originCoords, destinationCoords)=> {
    try{
        const response = await mapsClient.directions({
            params:{
                origin: `${originCoords[1]},${originCoords[0]}`,
                destination: `${destinationCoords[1]},${destinationCoords[0]}`,
                mode:'driving',
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });
        const route = response.data.routes[0];
        if(!route) {
            return {duration: null, distance: null};
        }
        const leg = route.legs[0];
        return{
            duration: leg.duration.text,
            durationSeconds: leg.duration.value,
            distance: leg.distance.text,
            distanceMeters: leg.distance.value
        };
    } catch (error){
        console.error('Maps API error:',  error.message);
        return {duration:null, distance:null};
    }
};
module.exports = { getETA };