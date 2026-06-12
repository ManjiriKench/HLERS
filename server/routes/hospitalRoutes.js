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

router.get('/:id', async(req,res)=> {
    try{
        const hospital = await Hospital.findById(req.params.id);
        if(!hospital) {
            return res.status(404).json({
                success:false,
                message:'Hospital not found'
            });
        }
        res.status(200).json({
            success:true,
            data:hospital
        });
    } catch(error){
        res.status(500).json({
            success:false,
            message:'Server error while fetching hospital'
        });
    }
});

router.post('/', async(req,res)=>{
        try{
            const hospital = await Hospital.create(req.body);
            res.status(201).json({
                success:true,
                data:hospital
            });
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    message :error.message
                });
            }
            res.status(500).json({
                success:false,
                message: 'Server error while creating hospital'
            });
        }
    });