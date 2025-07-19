import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { authenticateUser } from '@/middlewares/auth';
import Orders from '@/models/orders';
import Gigs from '@/models/Gigs';

export async function GET(request) {
  try {
    console.log('[Backend] Starting analytics performance API call...');
    await connectToDB();

    const authResult = await authenticateUser(request);
    if (authResult instanceof Response) {
      console.log('[Backend] Authentication failed');
      return authResult;
    }

    const { user } = authResult;
    const sellerId = user._id;
    console.log('[Backend] Authenticated seller:', sellerId);

    // Check if user is a seller
    if (!user.isSeller) {
      console.log('[Backend] User is not a seller');
      return NextResponse.json({ 
        success: false, 
        message: 'Access denied. User is not a seller.' 
      }, { status: 403 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'last-3-months';

    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case 'last-30-days':
        startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        break;
      case 'last-3-months':
        startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
        break;
      case 'last-6-months':
        startDate = new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000));
        break;
      case 'last-year':
        startDate = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));
        break;
      default:
        startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
    }

    // Fetch seller's orders and gigs
    const orders = await Orders.find({ 
      seller: sellerId,
      createdAt: { $gte: startDate }
    }).populate('gig', 'title category');

    const allGigs = await Gigs.find({ seller: sellerId });

    console.log('[Backend] Orders found:', orders.length);
    console.log('[Backend] Gigs found:', allGigs.length);

    // Category breakdown
    const categoryStats = {};
    
    orders.forEach(order => {
      if (order.status === 'completed') {
        const category = order.gig?.category || 'Other';
        const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        if (!categoryStats[categoryName]) {
          categoryStats[categoryName] = {
            name: categoryName,
            earnings: 0,
            orders: 0,
            value: 0
          };
        }
        
        categoryStats[categoryName].earnings += (order.transferAmount || (order.price * 0.95)) / 100;
        categoryStats[categoryName].orders += 1;
      }
    });

    // Calculate percentages for category breakdown
    const totalCategoryEarnings = Object.values(categoryStats).reduce((sum, cat) => sum + cat.earnings, 0);
    const categoryBreakdown = Object.values(categoryStats).map(cat => ({
      ...cat,
      value: totalCategoryEarnings > 0 ? Math.round((cat.earnings / totalCategoryEarnings) * 100) : 0
    }));

    console.log('[Backend] Category breakdown calculated:', categoryBreakdown.length, 'categories');

    // Monthly comparison (last 6 months)
    const monthlyComparison = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= monthStart && orderDate <= monthEnd && order.status === 'completed';
      });

      const monthEarnings = monthOrders.reduce((sum, order) => 
        sum + (order.transferAmount || (order.price * 0.95)), 0) / 100;

      // Calculate average rating for the month
      const ratedOrders = monthOrders.filter(order => order.isRated);
      const avgRating = ratedOrders.length > 0
        ? ratedOrders.reduce((sum, order) => sum + (order.rating?.average || 5), 0) / ratedOrders.length
        : 0;

      monthlyComparison.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        earnings: monthEarnings,
        orders: monthOrders.length,
        avgRating: Math.round(avgRating * 10) / 10
      });
    }

    console.log('[Backend] Monthly comparison calculated:', monthlyComparison.length, 'months');

    // Gig performance metrics
    const gigPerformance = allGigs.map(gig => {
      const gigOrders = orders.filter(order => order.gig?._id.toString() === gig._id.toString());
      const completedOrders = gigOrders.filter(order => order.status === 'completed');
      
      const earnings = completedOrders.reduce((sum, order) => 
        sum + (order.transferAmount || (order.price * 0.95)), 0) / 100;

      const conversionRate = gig.clicks > 0 ? (completedOrders.length / gig.clicks) * 100 : 0;

      return {
        id: gig._id,
        title: gig.title,
        category: gig.category,
        views: gig.views || 0,
        impressions: gig.impressions || 0,
        clicks: gig.clicks || 0,
        orders: completedOrders.length,
        earnings,
        conversionRate: Math.round(conversionRate * 100) / 100,
        rating: gig.rating?.average || 0,
        status: gig.status
      };
    }).sort((a, b) => b.earnings - a.earnings);

    console.log('[Backend] Gig performance calculated for', gigPerformance.length, 'gigs');

    // Top performing gigs (top 5)
    const topGigs = gigPerformance.slice(0, 5);

    const responseData = {
      categoryBreakdown,
      monthlyComparison,
      gigPerformance,
      topGigs,
      summary: {
        totalCategories: categoryBreakdown.length,
        bestCategory: categoryBreakdown.length > 0 ? categoryBreakdown[0] : null,
        totalGigEarnings: gigPerformance.reduce((sum, gig) => sum + gig.earnings, 0),
        avgConversionRate: gigPerformance.length > 0 
          ? gigPerformance.reduce((sum, gig) => sum + gig.conversionRate, 0) / gigPerformance.length 
          : 0
      }
    };

    console.log('[Backend] Performance analytics response prepared');

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('[Backend] Error in analytics performance API:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Internal server error', 
      error: error.message 
    }, { status: 500 });
  }
}