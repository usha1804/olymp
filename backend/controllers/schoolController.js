const School = require('../models/School');

// Get all schools
exports.getSchools = async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new school
exports.createSchool = async (req, res) => {
  try {
    const newSchool = new School(req.body);
    const savedSchool = await newSchool.save();
    res.status(201).json(savedSchool);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a school
exports.deleteSchool = async (req, res) => {
  try {
    await School.findByIdAndDelete(req.params.id);
    res.json({ message: 'School deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a school
exports.updateSchool = async (req, res) => {
  try {
    const updatedSchool = await School.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedSchool);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
