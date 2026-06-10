const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');

router.get('/',async(req,res)=> {
    try{
        const hospitals = await Hospital.find({});
        res.status(200).json({
            success:true,
            count: hospitals.length,
            data: hospitals
        });
    } catch(error){
        res.status(500).json({
            success:false,
            message:'Server error while fetching hospitals'
        });
    }
});