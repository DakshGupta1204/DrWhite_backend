const ServiceProvider = require("../models/ServiceProvider");
const Category = require("../models/Category");

// Get all service providers - admin only
exports.getAllServiceProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find().populate('category');
    res.status(200).json(providers);
  } catch (error) {
    console.error("Error fetching service providers:", error);
    res.status(500).json({ message: "Error fetching service providers", error: error.message });
  }
};

// Get service providers by category
exports.getServiceProvidersByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    const providers = await ServiceProvider.find({ 
      category: categoryId,
      isAvailable: true 
    }).populate('category');
    
    res.status(200).json(providers);
  } catch (error) {
    console.error("Error fetching service providers by category:", error);
    res.status(500).json({ message: "Error fetching service providers", error: error.message });
  }
};

// Get service providers by location
exports.getServiceProvidersByLocation = async (req, res) => {
  try {
    const { lat, lng, radius = 10, categoryId } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }
    
    // Convert to numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const searchRadius = parseFloat(radius);
    
    // Find providers within the radius (using MongoDB's geospatial queries would be better)
    // For now, we'll do a simple approximation
    const query = {
      isAvailable: true,
      'location.lat': { $gte: latitude - 0.1 * searchRadius, $lte: latitude + 0.1 * searchRadius },
      'location.lng': { $gte: longitude - 0.1 * searchRadius, $lte: longitude + 0.1 * searchRadius }
    };
    
    // Add category filter if provided
    if (categoryId) {
      query.category = categoryId;
    }
    
    const providers = await ServiceProvider.find(query).populate('category');
    
    // Calculate actual distance and filter (more accurate than the initial query)
    const filteredProviders = providers.filter(provider => {
      const distance = calculateDistance(
        latitude, longitude, 
        provider.location.lat, provider.location.lng
      );
      
      // Add distance to the provider object for sorting
      provider._doc.distance = distance;
      
      // Keep only providers within the actual radius
      return distance <= searchRadius;
    });
    
    // Sort by distance
    filteredProviders.sort((a, b) => a._doc.distance - b._doc.distance);
    
    res.status(200).json(filteredProviders);
  } catch (error) {
    console.error("Error fetching service providers by location:", error);
    res.status(500).json({ message: "Error fetching service providers", error: error.message });
  }
};

// Get a single service provider by ID
exports.getServiceProviderById = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id).populate('category');
    
    if (!provider) {
      return res.status(404).json({ message: "Service provider not found" });
    }
    
    res.status(200).json(provider);
  } catch (error) {
    console.error("Error fetching service provider:", error);
    res.status(500).json({ message: "Error fetching service provider", error: error.message });
  }
};

// Create a new service provider - admin only
exports.createServiceProvider = async (req, res) => {
  try {
    const {
      name,
      category,
      address,
      location,
      contacts,
      rating,
      reviews,
      priceRange,
      isVerified,
      isAvailable,
      description,
      images,
      openingHours,
      services,
      experienceYears,
      certifications
    } = req.body;
    
    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    const newProvider = new ServiceProvider({
      name,
      category,
      address,
      location,
      contacts,
      rating,
      reviews,
      priceRange,
      isVerified,
      isAvailable,
      description,
      images,
      openingHours,
      services,
      experienceYears,
      certifications
    });
    
    await newProvider.save();
    
    const populatedProvider = await ServiceProvider.findById(newProvider._id).populate('category');
    
    res.status(201).json(populatedProvider);
  } catch (error) {
    console.error("Error creating service provider:", error);
    res.status(500).json({ message: "Error creating service provider", error: error.message });
  }
};

// Update a service provider - admin only
exports.updateServiceProvider = async (req, res) => {
  try {
    const {
      name,
      category,
      address,
      location,
      contacts,
      rating,
      reviews,
      priceRange,
      isVerified,
      isAvailable,
      description,
      images,
      openingHours,
      services,
      experienceYears,
      certifications
    } = req.body;
    
    // If category is being updated, verify it exists
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
      }
    }
    
    const updatedProvider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        address,
        location,
        contacts,
        rating,
        reviews,
        priceRange,
        isVerified,
        isAvailable,
        description,
        images,
        openingHours,
        services,
        experienceYears,
        certifications
      },
      { new: true, runValidators: true }
    ).populate('category');
    
    if (!updatedProvider) {
      return res.status(404).json({ message: "Service provider not found" });
    }
    
    res.status(200).json(updatedProvider);
  } catch (error) {
    console.error("Error updating service provider:", error);
    res.status(500).json({ message: "Error updating service provider", error: error.message });
  }
};

// Delete a service provider - admin only
exports.deleteServiceProvider = async (req, res) => {
  try {
    const deletedProvider = await ServiceProvider.findByIdAndDelete(req.params.id);
    
    if (!deletedProvider) {
      return res.status(404).json({ message: "Service provider not found" });
    }
    
    res.status(200).json({ message: "Service provider deleted successfully" });
  } catch (error) {
    console.error("Error deleting service provider:", error);
    res.status(500).json({ message: "Error deleting service provider", error: error.message });
  }
};

// Helper function to calculate distance between two coordinates in kilometers
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
} 