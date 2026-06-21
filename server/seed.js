const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hospital = require('./models/Hospital');

dotenv.config();
const hospitals = [
    {
        name: 'Ruby Hall Clinic',
        address: '40 Sassoon Road, Pune, Maharashtra 411001',
        phone: '9823012345',
        location: {
            type: 'Point',
            coordinates: [73.8826, 18.5314]
        },
        emergencyTypes: ['cardiac','trauma','stroke'],
        totalICUBeds:20,
        availableICUBeds:8,
        emergencyDeptOpen: true,
        currentLoad: 5,
        specialists:[
            { name:'Dr. Sharma', type:'cardiologist', available:true },
            { name: 'Dr. Patil', type:'trauma surgeon', available:true }
        ]
    },
    {
    name: 'Deenanath Mangeshkar Hospital',
    address: 'Erandwane, Pune, Maharashtra 411004',
    phone: '9823056789',
    location: {
      type: 'Point',
      coordinates: [73.8401, 18.5089]
    },
    emergencyTypes: ['cardiac', 'stroke', 'general'],
    totalICUBeds: 30,
    availableICUBeds: 3,
    emergencyDeptOpen: true,
    currentLoad: 9,
    specialists: [
      { name: 'Dr. Joshi', type: 'neurologist', available: true },
      { name: 'Dr. Kulkarni', type: 'cardiologist', available: false }
    ]
  },
  {
    name: 'KEM Hospital Pune',
    address: 'Rasta Peth, Pune, Maharashtra 411011',
    phone: '9823078901',
    location: {
      type: 'Point',
      coordinates: [73.8777, 18.5158]
    },
    emergencyTypes: ['trauma', 'burns', 'general'],
    totalICUBeds: 25,
    availableICUBeds: 12,
    emergencyDeptOpen: true,
    currentLoad: 3,
    specialists: [
      { name: 'Dr. Desai', type: 'trauma surgeon', available: true },
      { name: 'Dr. More', type: 'burn specialist', available: true }
    ]
  },
  {
    name: 'Sassoon General Hospital',
    address: 'Pune Station Area, Pune, Maharashtra 411001',
    phone: '9823090123',
    location: {
      type: 'Point',
      coordinates: [73.8764, 18.5236]
    },
    emergencyTypes: ['cardiac', 'trauma', 'burns', 'stroke', 'general'],
    totalICUBeds: 50,
    availableICUBeds: 15,
    emergencyDeptOpen: true,
    currentLoad: 6,
    specialists: [
      { name: 'Dr. Bhosale', type: 'cardiologist', available: true },
      { name: 'Dr. Jadhav', type: 'trauma surgeon', available: false },
      { name: 'Dr. Wagh', type: 'neurologist', available: true }
    ]
  },
  {
    name: 'Jehangir Hospital',
    address: '32 Sassoon Road, Pune, Maharashtra 411001',
    phone: '9823034567',
    location: {
      type: 'Point',
      coordinates: [73.8831, 18.5298]
    },
    emergencyTypes: ['cardiac', 'stroke', 'general'],
    totalICUBeds: 15,
    availableICUBeds: 0,
    emergencyDeptOpen: false,
    currentLoad: 10,
    specialists: [
      { name: 'Dr. Irani', type: 'cardiologist', available: false }
    ]
  }
];

const seedDatabase = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected for seeding');

        await Hospital.deleteMany({});
        console.log('Existing hospitals cleared');

        await Hospital.insertMany(hospitals);
        console.log('5 Pune hospitals seeded successfully');

        await mongoose.disconnect();
        console.log('MongoDB disconnected');
        process.exit(0);
    } catch(error){
        console.error('Seed error:', error.message);
        process.exit(1);
    }
};

seedDatabase();
