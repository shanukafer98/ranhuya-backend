import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    imageUrls: {
      type: [String],
      required: true,
    },
    videoUrl: {
      type: String,
      required: false,  // Change to true if the video is mandatory
    },
    userRef: {
      type: String,
      required: true,
    },
    
    categorie: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    contactNumber1: {
      type: String,
      required: true,
    },
    contactNumber2: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;


//Updated