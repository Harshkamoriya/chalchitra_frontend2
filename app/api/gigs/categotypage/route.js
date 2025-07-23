import mongoose from 'mongoose';
import Gigs from '@/models/Gigs';
import User from '@/models/user';
import { connectToDB } from '@/lib/db';

export async function GET(request) {
  try {
    // Connect to MongoDB if not already connected
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const maxDelivery = searchParams.get('maxDelivery');
    const minRating = searchParams.get('minRating');
    const sort = searchParams.get('sort');

    // Build query
    const query = {
      category: category,
      status: 'live', // Only fetch live gigs
    };

    // Add price filters
    if (minPrice) {
      query['packages.price'] = { $gte: parseFloat(minPrice) };
    }
    if (maxPrice) {
      query['packages.price'] = { ...query['packages.price'], $lte: parseFloat(maxPrice) };
    }

    // Add delivery time filter
    if (maxDelivery) {
      query['packages.deliveryTime'] = { $lte: parseInt(maxDelivery) };
    }

    // Add rating filter
    if (minRating && minRating !== 'any') {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    // Build sort options
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'price-asc':
        sortOption = { 'packages.price': 1 };
        break;
      case 'price-desc':
        sortOption = { 'packages.price': -1 };
        break;
      case 'rating':
        sortOption = { 'rating.average': -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Fetch gigs with populated seller data
    const gigs = await Gigs.find(query)
      .populate({
        path: 'seller',
        select: 'firstname lastname profilePicture rating',
      })
      .sort(sortOption)
      .lean();

    // Transform the data to match frontend expectations
    const formattedGigs = gigs.map(gig => ({
      _id: gig._id.toString(),
      title: gig.title,
      images: gig.media?.gallery || [],
      tags: gig.tags || [],
      rating: {
        average: gig.rating?.average || 0,
        count: gig.rating?.count || 0,
      },
      packages: {
        price: gig.packages[0]?.price || 25,
        deliveryTime: gig.packages[0]?.deliveryTime || 3,
      },
      seller: {
        firstName: gig.seller?.firstname || '',
        lastName: gig.seller?.lastname || '',
        profilePicture: gig.seller?.image || '',
      },
    }));

    return new Response(JSON.stringify({
      success: true,
      gigs: formattedGigs,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching gigs:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch gigs',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}