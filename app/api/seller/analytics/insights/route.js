import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { authenticateUser } from '@/middlewares/auth';
import Orders from '@/models/orders';
import Gigs from '@/models/Gigs';
import Withdrawal from '@/models/Withdrwal';

export async function GET(request) {
  try {
    console.log('[Backend] Starting analytics insights API call...');
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

    // Fetch all seller data
    const allOrders = await Orders.find({ seller: sellerId })
      .populate('gig', 'title category packages')
      .sort({ createdAt: -1 });

    const allGigs = await Gigs.find({ seller: sellerId });
    
    const withdrawals = await Withdrawal.find({ userId: sellerId })
      .sort({ createdAt: -1 });

    console.log('[Backend] Data fetched - Orders:', allOrders.length, 'Gigs:', allGigs.length, 'Withdrawals:', withdrawals.length);

    // Calculate current period vs previous period
    const now = new Date();
    const currentPeriodStart = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)); // Last 30 days
    const previousPeriodStart = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000)); // 30-60 days ago

    const currentPeriodOrders = allOrders.filter(order => 
      new Date(order.createdAt) >= currentPeriodStart
    );
    
    const previousPeriodOrders = allOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= previousPeriodStart && orderDate < currentPeriodStart;
    });

    // Calculate growth metrics
    const currentEarnings = currentPeriodOrders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + (order.transferAmount || (order.price * 0.95)), 0) / 100;

    const previousEarnings = previousPeriodOrders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + (order.transferAmount || (order.price * 0.95)), 0) / 100;

    const earningsGrowth = previousEarnings > 0 
      ? ((currentEarnings - previousEarnings) / previousEarnings) * 100 
      : 0;

    const currentOrderCount = currentPeriodOrders.filter(order => order.status === 'completed').length;
    const previousOrderCount = previousPeriodOrders.filter(order => order.status === 'completed').length;
    
    const orderGrowth = previousOrderCount > 0 
      ? ((currentOrderCount - previousOrderCount) / previousOrderCount) * 100 
      : 0;

    // Calculate completion rate
    const completedOrders = allOrders.filter(order => order.status === 'completed').length;
    const totalOrders = allOrders.length;
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    // Calculate client satisfaction
    const ratedOrders = allOrders.filter(order => order.isRated);
    const avgRating = ratedOrders.length > 0
      ? ratedOrders.reduce((sum, order) => sum + (order.rating?.average || 5), 0) / ratedOrders.length
      : 0;

    // Find best performing category
    const categoryPerformance = {};
    allOrders.forEach(order => {
      if (order.status === 'completed' && order.gig?.category) {
        const category = order.gig.category;
        if (!categoryPerformance[category]) {
          categoryPerformance[category] = { earnings: 0, orders: 0 };
        }
        categoryPerformance[category].earnings += (order.transferAmount || (order.price * 0.95)) / 100;
        categoryPerformance[category].orders += 1;
      }
    });

    const bestCategory = Object.entries(categoryPerformance)
      .sort(([,a], [,b]) => b.earnings - a.earnings)[0];

    // Generate insights based on data
    const insights = [];

    // Growth insight
    if (earningsGrowth > 10) {
      insights.push({
        type: 'positive',
        title: 'Strong Growth',
        message: `Your earnings have increased by ${earningsGrowth.toFixed(1)}% compared to the previous period. Keep up the excellent work!`,
        icon: 'trending-up'
      });
    } else if (earningsGrowth < -10) {
      insights.push({
        type: 'warning',
        title: 'Revenue Decline',
        message: `Your earnings have decreased by ${Math.abs(earningsGrowth).toFixed(1)}%. Consider reviewing your pricing or marketing strategy.`,
        icon: 'trending-down'
      });
    }

    // Quality insight
    if (completionRate > 90 && avgRating > 4.5) {
      insights.push({
        type: 'positive',
        title: 'High Quality Service',
        message: `Your ${completionRate.toFixed(1)}% completion rate and ${avgRating.toFixed(1)}/5 client satisfaction score indicate exceptional service quality.`,
        icon: 'award'
      });
    }

    // Category insight
    if (bestCategory) {
      const categoryName = bestCategory[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      insights.push({
        type: 'info',
        title: 'Top Performing Category',
        message: `${categoryName} is your most profitable category with $${bestCategory[1].earnings.toFixed(2)} in earnings. Consider creating more gigs in this category.`,
        icon: 'target'
      });
    }

    // Generate recommendations
    const recommendations = [];

    // Pricing recommendation
    if (avgRating > 4.7 && completionRate > 95) {
      recommendations.push({
        title: 'Increase Service Pricing',
        description: 'Your high satisfaction rate suggests you can increase prices by 10-15%',
        priority: 'high'
      });
    }

    // Category expansion
    if (bestCategory && bestCategory[1].orders > 3) {
      const categoryName = bestCategory[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      recommendations.push({
        title: 'Expand Popular Services',
        description: `Create more gigs in ${categoryName} as it's your top-performing category`,
        priority: 'medium'
      });
    }

    // Response time recommendation
    recommendations.push({
      title: 'Improve Response Time',
      description: 'Faster responses can increase your conversion rate by up to 20%',
      priority: 'medium'
    });

    // Client retention
    const uniqueBuyers = [...new Set(allOrders.map(order => order.buyer.toString()))];
    const repeatClients = uniqueBuyers.filter(buyerId => {
      const buyerOrders = allOrders.filter(order => order.buyer.toString() === buyerId);
      return buyerOrders.length > 1;
    });
    const retentionRate = uniqueBuyers.length > 0 ? (repeatClients.length / uniqueBuyers.length) * 100 : 0;

    if (retentionRate < 40) {
      recommendations.push({
        title: 'Client Retention Program',
        description: `Offer discounts to repeat clients to increase your ${retentionRate.toFixed(1)}% retention rate`,
        priority: 'high'
      });
    }

    // Performance goals
    const monthlyEarningsGoal = 2000; // Can be made dynamic
    const currentMonthEarnings = currentEarnings;
    const earningsGoalProgress = (currentMonthEarnings / monthlyEarningsGoal) * 100;

    const satisfactionGoal = 4.9;
    const satisfactionProgress = (avgRating / satisfactionGoal) * 100;

    const completionGoal = 98;
    const completionProgress = (completionRate / completionGoal) * 100;

    console.log('[Backend] Insights and recommendations generated');

    const responseData = {
      insights,
      recommendations,
      growthMetrics: {
        earningsGrowth: Math.round(earningsGrowth * 10) / 10,
        orderGrowth: Math.round(orderGrowth * 10) / 10,
        currentEarnings,
        previousEarnings,
        currentOrderCount,
        previousOrderCount
      },
      performanceGoals: [
        {
          title: 'Monthly Earnings Goal',
          target: monthlyEarningsGoal,
          current: currentMonthEarnings,
          progress: Math.min(100, earningsGoalProgress),
          unit: 'currency'
        },
        {
          title: 'Client Satisfaction',
          target: satisfactionGoal,
          current: avgRating,
          progress: Math.min(100, satisfactionProgress),
          unit: 'rating'
        },
        {
          title: 'Order Completion',
          target: completionGoal,
          current: completionRate,
          progress: Math.min(100, completionProgress),
          unit: 'percentage'
        }
      ],
      businessHealth: {
        completionRate,
        avgRating,
        retentionRate,
        activeGigs: allGigs.filter(gig => gig.status === 'live').length,
        totalWithdrawals: withdrawals.length,
        totalWithdrawnAmount: withdrawals
          .filter(w => w.status === 'completed')
          .reduce((sum, w) => sum + w.amount, 0) / 100
      }
    };

    console.log('[Backend] Analytics insights response prepared');

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('[Backend] Error in analytics insights API:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Internal server error', 
      error: error.message 
    }, { status: 500 });
  }
}