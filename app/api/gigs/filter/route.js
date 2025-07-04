import { NextResponse } from 'next/server';
import Gigs from '@/models/Gigs';
import { connectToDB } from '@/lib/db';
import User from '@/models/user';

export async function GET(req) {
  try {
    await connectToDB();
    console.log('✅ Connected to database');

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const maxDelivery = searchParams.get('maxDelivery');
    const minRating = searchParams.get('minRating');
    const tags = searchParams.get('tags'); // CSV
    const sellerCountry = searchParams.get('sellerCountry');
    const sellerLevel = searchParams.get('sellerLevel');
    const sort = searchParams.get('sort');

    console.log('🧩 Received filters:', { category, minPrice, maxPrice, maxDelivery, minRating, tags, sellerCountry, sellerLevel, sort });

    const pipeline = [
      { $match: { status: 'active' } },
      {
        $lookup: {
          from: 'users',
          localField: 'seller',
          foreignField: '_id',
          as: 'seller'
        }
      },
      { $unwind: '$seller' }
    ];

    if (category) {
      pipeline.push({ $match: { category } });
    }

    pipeline.push({ $unwind: { path: '$packages', preserveNullAndEmptyArrays: true } });

    const orConditions = [];

    if (minPrice || maxPrice) {
      orConditions.push({
        'packages.price': {
          ...(minPrice ? { $gte: Number(minPrice) } : {}),
          ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
        }
      });
    }
    if (maxDelivery) {
      orConditions.push({ 'packages.deliveryTime': { $lte: Number(maxDelivery) } });
    }
    if (minRating) {
      orConditions.push({ 'rating.average': { $gte: Number(minRating) } });
    }
    if (tags) {
      orConditions.push({ tags: { $in: tags.split(',') } });
    }
    if (sellerCountry) {
      orConditions.push({ 'seller.country': sellerCountry });
    }
    if (sellerLevel) {
      orConditions.push({ 'seller.level': sellerLevel });
    }

    if (orConditions.length > 0) {
      pipeline.push({ $match: { $or: orConditions } });
    }

    if (sort === 'price-asc') {
      pipeline.push({ $sort: { 'packages.price': 1 } });
    } else if (sort === 'price-desc') {
      pipeline.push({ $sort: { 'packages.price': -1 } });
    } else {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    console.log('📦 Final aggregation pipeline:', JSON.stringify(pipeline, null, 2));

    const gigs = await Gigs.aggregate(pipeline);
    console.log(`✅ Found ${gigs.length} gigs`);

    return NextResponse.json({ success: true, gigs });

  } catch (error) {
    console.error('❌ Error fetching gigs:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch gigs' }, { status: 500 });
  }
}
