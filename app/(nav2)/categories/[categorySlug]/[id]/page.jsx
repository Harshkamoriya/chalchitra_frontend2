"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Clock,
  CheckCircle,
  Play,
  Heart,
  Share2,
  MessageCircle,
  ArrowRight,
  User,
  Calendar,
  RefreshCw,
  Zap,
  Award,
  Globe,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Video,
  Image as ImageIcon,
  FileText,
  Shield,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/app/(nav2)/context/AuthContext';
import { parseAppSegmentConfig } from 'next/dist/build/segment-config/app/app-segment-config';

// Mock data - replace with actual API call
// const mockGig = {
//   id: '1',
//   title: 'Professional YouTube Video Editing',
//   description: 'I will create engaging YouTube videos with professional editing, color grading, and motion graphics',
//   seller: {
//     id: 'seller1',
//     name: 'Alex Johnson',
//     displayName: 'VideoProAlex',
//     image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
//     rating: { average: 4.9, count: 247 },
//     sellerLevel: 'top_rated',
//     completedOrders: 1250,
//     country: 'United States',
//     languages: ['English', 'Spanish'],
//     description: 'Professional video editor with 8+ years of experience in YouTube content creation'
//   },
//   category: 'youtube-vlog-editing',
//   tags: ['YouTube', 'Video Editing', 'Color Grading', 'Motion Graphics'],
//   maxDuration: '30 minutes',
//   packages: [
//     {
//       name: 'Basic',
//       price: 25,
//       deliveryTime: 3,
//       revisions: 2,
//       features: [
//         'Basic video editing',
//         'Color correction',
//         'Audio sync',
//         'Simple transitions',
//         'Thumbnail design'
//       ],
//       rushDelivery: true,
//       rushTime: '24 hours',
//       rushPrice: 15,
//       inputLength: 'Up to 10 minutes',
//       outputLength: 'Up to 8 minutes'
//     },
//     {
//       name: 'Standard',
//       price: 50,
//       deliveryTime: 5,
//       revisions: 3,
//       features: [
//         'Professional video editing',
//         'Advanced color grading',
//         'Audio enhancement',
//         'Motion graphics',
//         'Custom transitions',
//         'Thumbnail + Banner design',
//         'SEO optimization'
//       ],
//       rushDelivery: true,
//       rushTime: '48 hours',
//       rushPrice: 25,
//       inputLength: 'Up to 20 minutes',
//       outputLength: 'Up to 15 minutes'
//     },
//     {
//       name: 'Premium',
//       price: 100,
//       deliveryTime: 7,
//       revisions: 5,
//       features: [
//         'Premium video editing',
//         'Cinematic color grading',
//         'Professional audio mixing',
//         'Advanced motion graphics',
//         'Custom animations',
//         'Complete branding package',
//         'Multiple format delivery',
//         'Priority support'
//       ],
//       rushDelivery: true,
//       rushTime: '72 hours',
//       rushPrice: 40,
//       inputLength: 'Up to 45 minutes',
//       outputLength: 'Up to 30 minutes'
//     }
//   ],
//   addOns: [
//     { id: 'extra-revision', price: 10, deliveryTime: '1 day' },
//     { id: 'rush-delivery', price: 20, deliveryTime: '24 hours' },
//     { id: 'source-files', price: 15, deliveryTime: '0 days' }
//   ],
//   media: {
//     coverImage: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
//     gallery: [
//       'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
//       'https://images.pexels.com/photos/7991580/pexels-photo-7991580.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
//       'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'
//     ],
//     video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
//   },
//   portfolioDescription: 'Specialized in creating engaging YouTube content with over 8 years of experience',
//   portfolioWebsite: 'https://videoproalex.com',
//   requirements: [
//     {
//       question: 'Please provide your raw video footage',
//       type: 'file',
//       required: true
//     },
//     {
//       question: 'What style of editing do you prefer?',
//       type: 'multiple-choice',
//       options: ['Cinematic', 'Fast-paced', 'Minimalist', 'Creative'],
//       required: true
//     }
//   ],
//   faq: [
//     {
//       question: 'What video formats do you accept?',
//       answer: 'I accept all major video formats including MP4, MOV, AVI, and more.'
//     },
//     {
//       question: 'Do you provide revisions?',
//       answer: 'Yes, revisions are included based on your selected package.'
//     }
//   ],
//   rating: { average: 4.9, count: 247 },
//   isFeatured: true,
//   status: 'active'
// };

const GigPage= () => {
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [mockGig , setMockGig] = useState(null);
  const [sellerId ,setSellerId]= useState(null);
  const [seller , setSeller] = useState(null);
   const router  = useRouter();
  const params  =useParams();
  const {user} = useAuth();
  let currentPackage ;
  
  console.log(user , "user in gig page");

  const id = params.id;

  const category = params.categorySlug;

  console.log(id , "gigId")

  const handleAddOnToggle = (addOnId) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const calculateTotal = () => {
   const packagePrice = currentPackage?.price || 0;
const addOnPrice = selectedAddOns.reduce((total, addOnId) => {
  const addOn = gig?.addOns?.find(a => a.id === addOnId);
  return total + (addOn?.price || 0);
}, 0);
return packagePrice + addOnPrice;

  };

  


 useEffect(() => {
  const fetchGig = async () => {
    try {
      const res = await axios.get(`/api/gigs/${id}`);
      if (!res.data.success) console.log("Gig data not fetched");
      setMockGig(res.data.gig);
      setSellerId(res.data.gig.seller);
    } catch (error) {
      console.log("Error fetching gig data", error.message);
    }
  };
  if(id) fetchGig();
}, [id]);

useEffect(() => {
  const fetchSeller = async () => {
    try {
      const res = await axios.get(`/api/user/${sellerId}`);
      if (!res.data.success) console.log("Seller data not fetched");
      setSeller(res.data.user);
    } catch (error) {
      console.error("Error fetching seller data", error.message);
    }
  };
  if(sellerId) fetchSeller();
}, [sellerId]);

  const gig = mockGig;


console.log(gig,"gig")


const handleContinue = async () => {
  try {
    // Build order data
    const orderData = {
      gigId: gig?._id,
      sellerId: seller?._id,
      buyerId: user?.id,   // get from session/context
      selectedPackage: gig?.packages[selectedPackage],
      requirements: gig?.requirements,
      addons: selectedAddOns,
      price: calculateTotal()
    };

    const res =  await api.post(`/api/orders/pending_payment`, orderData)
    if(res.data.success){
      const orderId = res.data.orderId;
      console.log("response  data , ", res.data)
      if(orderId){
        router.push(` /payment/${orderId}`)
      }
    }
     else {
      toast.error("Failed to create order");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};


  const getLevelBadge = (level) => {
    const badges = {
      new: { text: 'New Seller', color: 'bg-gray-100 text-gray-700' },
      level_1: { text: 'Level 1', color: 'bg-blue-100 text-blue-700' },
      level_2: { text: 'Level 2', color: 'bg-purple-100 text-purple-700' },
      top_rated: { text: 'Top Rated', color: 'bg-yellow-100 text-yellow-700' }
    };
    return badges[level] || badges.new;
  };

   if(gig){
       currentPackage = gig?.packages?.[selectedPackage];

   }

   if (!gig) {
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      Loading gig?...
    </div>
  );
}

  return (

   
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm text-gray-500">
            <span>Video Editing</span> / <span>YouTube Editing</span> / <span className="text-gray-900">{gig?.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {gig?.title}
                  </h1>
                  <p className="text-gray-600 text-lg mb-4">
                    {showFullDescription ? gig?.description : `${gig?.description.slice(0, 120)}...`}
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-blue-600 hover:text-blue-700 ml-2 font-medium"
                    >
                      {showFullDescription ? 'Show less' : 'Show more'}
                    </button>
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {gig?.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Rating and Stats */}
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">{gig?.rating.average}</span>
                      <span>({gig?.rating.count} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>1.2k orders in queue</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Media Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative">
                {showVideo && gig?.media.video ? (
                  <video
                    controls
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                    poster={gig?.media.coverImage}
                  >
                    <source src={gig?.media.video} type="video/mp4" />
                  </video>
                ) : (
                  <div className="relative">
                    <img
                      src={gig?.media.gallery[activeImageIndex] || gig?.media.coverImage}
                      alt={gig?.title}
                      className="w-full h-[400px] lg:h-[500px] object-cover"
                    />
                    {gig?.media.video && (
                      <button
                        onClick={() => setShowVideo(true)}
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all group"
                      >
                        <div className="bg-white rounded-full p-4 group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-gray-900 ml-1" />
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {gig?.media.gallery.length > 1 && (
                <div className="p-4 bg-gray-50">
                  <div className="flex gap-2 overflow-x-auto">
                    {gig?.media.gallery.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setActiveImageIndex(index);
                          setShowVideo(false);
                        }}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImageIndex === index && !showVideo
                            ? 'border-blue-500'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                    {gig?.media.video && (
                      <button
                        onClick={() => setShowVideo(true)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center bg-gray-100 ${
                          showVideo ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Video className="w-6 h-6 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* About This Gig */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Gig</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {gig?.portfolioDescription}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Max Duration</div>
                      <div className="text-sm text-gray-600">{gig?.maxDuration}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Award className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Category</div>
                      <div className="text-sm text-gray-600 capitalize">
                        {gig?.category.replace('-', ' ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            {gig?.faq.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {gig?.faq.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedFAQ === index ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedFAQ === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-3 text-gray-700">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seller Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About The Seller</h2>
              <div className="flex items-start gap-4">
                <img
                  src={seller?.image}
                  alt={seller?.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-900">{seller?.displayName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelBadge(gig?.seller.sellerLevel).color}`}>
                      {getLevelBadge(seller?.sellerLevel).text}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{seller?.rating.average} ({seller?.rating.count})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{seller?.completedOrders} orders</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <span>{seller?.country}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{seller?.description}</p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Contact Me
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Pricing */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Package Tabs */}
                <div className="flex border-b border-gray-200">
                  {gig?.packages.map((pkg, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPackage(index)}
                      className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                        selectedPackage === index
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {pkg.name}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-gray-900">${currentPackage.price}</span>
                      {currentPackage.rushDelivery && (
                        <span className="text-sm text-gray-500">+ ${currentPackage.rushPrice} rush</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      Save up to 15% with Subscribe to Save
                    </p>
                  </div>

                  {/* Package Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>Delivery Time</span>
                      </div>
                      <span className="font-medium">{currentPackage.deliveryTime} days</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-gray-500" />
                        <span>Revisions</span>
                      </div>
                      <span className="font-medium">{currentPackage.revisions}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-gray-500" />
                        <span>Input Length</span>
                      </div>
                      <span className="font-medium">{currentPackage.inputLength}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Play className="w-4 h-4 text-gray-500" />
                        <span>Output Length</span>
                      </div>
                      <span className="font-medium">{currentPackage.outputLength}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">What's included:</h4>
                    <div className="space-y-2">
                      {currentPackage.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add-ons */}
                  {gig?.addOns.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Add-ons:</h4>
                      <div className="space-y-2">
                        {gig?.addOns.map((addOn) => (
                          <div key={addOn.id} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAddOnToggle(addOn.id)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                  selectedAddOns.includes(addOn.id)
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'border-gray-300 hover:border-blue-400'
                                }`}
                              >
                                {selectedAddOns.includes(addOn.id) && (
                                  <CheckCircle className="w-3 h-3 text-white" />
                                )}
                              </button>
                              <span className="text-sm text-gray-700 capitalize">
                                {addOn.id.replace('-', ' ')}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">+${addOn.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rush Delivery */}
                  {currentPackage.rushDelivery && (
                    <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-orange-600" />
                        <span className="font-medium text-orange-900">Rush Delivery Available</span>
                      </div>
                      <p className="text-sm text-orange-700">
                        Get your order in {currentPackage.rushTime} for an additional ${currentPackage.rushPrice}
                      </p>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${calculateTotal()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleContinue}
                      className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                    
                    <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Contact Seller
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        <span>Money-back guarantee</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Quality assured</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigPage;