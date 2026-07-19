const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const { getETA } = require('../services/mapsService');
const { getMLScores } = require('../services/mlService');

router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find({});

    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching hospitals',
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found',
      });
    }

    res.status(200).json({
      success: true,
      data: hospital,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error while fetching hospital',
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);

    res.status(201).json({
      success: true,
      data: hospital,
    });
  } catch (error) {
    console.error(error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating hospital',
    });
  }
});

router.patch('/:id/capacity', async (req, res) => {
  try {
    const allowedFields = [
      'availableICUBeds',
      'currentLoad',
      'emergencyDeptOpen',
      'specialists',
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    updates.lastUpdated = Date.now();

    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found',
      });
    }

    res.status(200).json({
      success: true,
      data: hospital,
    });
  } catch (error) {
    console.error(error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating hospital capacity',
    });
  }
});

router.post('/nearby', async (req, res) => {
  try {
    const {
      longitude,
      latitude,
      emergencyType,
      maxDistance,
    } = req.body;

    if (!longitude || !latitude || !emergencyType) {
      return res.status(400).json({
        success: false,
        message: 'Longitude, latitude and emergency type are required',
      });
    }

    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance || 10000,
        },
      },
      emergencyDeptOpen: true,
      emergencyTypes: emergencyType,
    });

    const hospitalsWithETA = await Promise.all(
      hospitals.map(async (hospital) => {
        const eta = await getETA(
          [longitude, latitude],
          hospital.location.coordinates
        );

        return {
          ...hospital.toObject(),
          eta,
        };
      })
    );

    const { ranked, recommendation } = await getMLScores(
      hospitalsWithETA,
      emergencyType
    );

    res.status(200).json({
      success: true,
      count: ranked.length,
      recommendation,
      data: ranked,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error while finding nearby hospitals',
    });
  }
});

module.exports = router;