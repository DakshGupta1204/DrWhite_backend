const mongoose = require("mongoose");

const serviceProviderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    address: { 
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      label: { type: String, required: true }, // Full formatted address
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    contacts: [{ 
      type: { type: String, enum: ['mobile', 'landline', 'email'], required: true },
      value: { type: String, required: true }
    }],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    priceRange: { type: String, default: "Varies" },
    isVerified: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    description: { type: String },
    images: [{ type: String }], // URLs to images
    openingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    services: [{ type: String }], // List of specific services offered
    experienceYears: { type: Number },
    certifications: [{ type: String }], // Certification names
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceProvider", serviceProviderSchema); 