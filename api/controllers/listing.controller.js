import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    const {
      title,
      description,
      address,
      regularPrice,
      categorie,
      district,
      contactNumber1,
      contactNumber2,
      imageUrls,
      videoUrl,
      userRef,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !address ||
      !regularPrice ||
      !categorie ||
      !district ||
      !contactNumber1 ||
      !imageUrls.length
    ) {
      return next(errorHandler(400, 'Missing required fields'));
    }

    const listing = await Listing.create({
      title,
      description,
      address,
      regularPrice,
      categorie,
      district,
      contactNumber1,
      contactNumber2,
      imageUrls,
      videoUrl,
      userRef,
    });

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef.toString()) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef.toString()) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const searchTerm = req.query.searchTerm || '';
    const category = req.query.categorie ? { categorie: req.query.categorie } : {};
    const district = req.query.district ? { district: req.query.district } : {};

    const sort = req.query.sort || 'createdAt';
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    const order = sort.startsWith('-') ? -1 : 1;

    // Build the query object
    const query = {
      ...(searchTerm && { title: { $regex: searchTerm, $options: 'i' } }),
      ...category,
      ...district,
    };

    // Fetch the listings from the database
    const listings = await Listing.find(query)
      .sort({ [sortField]: order })
      .limit(limit)
      .skip(startIndex);

    // Return the results
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
