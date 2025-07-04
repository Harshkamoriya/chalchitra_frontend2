"use client"

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  ArrowLeft, 
  Star, 
  Heart, 
  MapPin, 
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Clock,
  DollarSign,
  Tag,
  Grid,
  List,
  Loader2,
  Check,
  Menu
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { createSlug } from '@/utility/slugify';
// Custom Dropdown Component
const CustomDropdown = ({ value, onChange, options, placeholder, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const Outside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', Outside);
    return () => document.removeEventListener('mousedown', Outside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-4 h-4 text-gray-500" />}
          <span className={`${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
            >
              <span className={`${option.value === value ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                {option.label}
              </span>
              {option.value === value && <Check className="w-4 h-4 text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Price Range Component
const PriceRange = ({ minPrice, maxPrice, onMinChange, onMaxChange }) => {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <DollarSign className="w-4 h-4" />
        Budget
      </label>
      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onMinChange(e.target.value)}
            className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
          />
        </div>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onMaxChange(e.target.value)}
            className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};

// Tags Component
const TagsFilter = ({ selectedTags, onTagChange, allowedTags }) => {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Tag className="w-4 h-4" />
        Skills & Tags
      </label>
      <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {allowedTags.map(tag => (
            <button
              key={tag}
              onClick={() => onTagChange(tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedTags.includes(tag)
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Filter Content Component (reusable for both desktop and mobile)
const FilterContent = ({ 
  selectedCategory, setSelectedCategory,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  maxDelivery, setMaxDelivery,
  minRating, setMinRating,
  selectedTags, handleTagChange,
  sort, setSort,
  applyFilters, clearFilters,
  filterLoading,
  categoryOptions, deliveryOptions, ratingOptions, sortOptions, allowedTags,
  activeFiltersCount,
  isMobile = false
}) => {
  return (
    <div className={`${isMobile ? 'p-6' : 'container mx-auto px-6 py-8'}`}>
      {isMobile && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-500 text-white text-sm rounded-full px-3 py-1">
              {activeFiltersCount} active
            </span>
          )}
        </div>
      )}

      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-6`}>
        {/* Category Filter */}
        <div className="space-y-3">
          <CustomDropdown
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categoryOptions}
            placeholder="All Categories"
            icon={Tag}
          />
        </div>

        {/* Price Range */}
        <PriceRange
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinChange={setMinPrice}
          onMaxChange={setMaxPrice}
        />

        {/* Delivery Time */}
        <div className="space-y-3">
          <CustomDropdown
            value={maxDelivery}
            onChange={setMaxDelivery}
            options={deliveryOptions}
            placeholder="Any Delivery"
            icon={Clock}
          />
        </div>

        {/* Rating Filter */}
        <div className="space-y-3">
          <CustomDropdown
            value={minRating}
            onChange={setMinRating}
            options={ratingOptions}
            placeholder="Any Rating"
            icon={Star}
          />
        </div>

        {/* Sort Options - Only show on mobile */}
        {isMobile && (
          <div className="space-y-3">
            <CustomDropdown
              value={sort}
              onChange={setSort}
              options={sortOptions}
              placeholder="Sort by"
            />
          </div>
        )}
      </div>

      {/* Tags Filter */}
      <div className="mt-8">
        <TagsFilter
          selectedTags={selectedTags}
          onTagChange={handleTagChange}
          allowedTags={allowedTags}
        />
      </div>

      {/* Action Buttons */}
      <div className={`flex flex-col gap-4 mt-8 pt-6 border-t border-gray-200 ${isMobile ? 'sticky bottom-0 bg-white' : 'sm:flex-row'}`}>
        <button
          onClick={applyFilters}
          disabled={filterLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          {filterLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Applying Filters...
            </>
          ) : (
            <>
              <Filter className="w-4 h-4" />
              Apply Filters
            </>
          )}
        </button>
        <button
          onClick={clearFilters}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200"
        >
          <X className="w-4 h-4" />
          Clear All
        </button>
      </div>
    </div>
  );
};

// Mobile Filter Drawer
const MobileFilterDrawer = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoized GigCard component
const GigCard = memo(({ gig, onClick, viewMode = 'grid' }) => {
  const [isLiked, setIsLiked] = useState(false);

  if (viewMode === 'list') {
    return (
      <div onClick={onClick} className="group bg-white rounded-xl p-6 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 flex gap-6">
        <div className="relative overflow-hidden rounded-lg flex-shrink-0">
          <img
            src={gig.media?.coverImage || "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=300"}
            alt={gig.title}
            className="w-32 h-24 object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full mb-2">
                {gig.category ? gig.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : "General"}
              </span>
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {gig.title}
              </h3>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className="p-2 rounded-full hover:bg-red-50 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'} transition-colors`} />
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{gig.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium text-gray-700">
                  {gig.rating?.average || 4.9}
                </span>
                <span className="ml-1 text-sm text-gray-500">({gig.rating?.count || 127})</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">From</span>
              <span className="text-xl font-bold text-green-600">${gig.packages?.[0]?.price || 40}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClick} className="group bg-white rounded-xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={gig.media?.coverImage || "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=500"}
          alt={gig.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'} transition-colors`} />
        </button>
      </div>

      <div className="p-5">
        <div className="mb-2">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
            {gig.category ? gig.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : "General"}
          </span>
        </div>

        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {gig.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {gig.description}
        </p>

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-700">
              {gig.rating?.average || 4.9}
            </span>
            <span className="ml-1 text-sm text-gray-500">({gig.rating?.count || 127})</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">From</span>
            <span className="text-xl font-bold text-green-600">${gig.packages?.[0]?.price || 40}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

GigCard.displayName = "GigCard";

const GigCategories = ({ 

  loading: initialLoading 
}) => {
  const scrollRef = useRef(null);
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxDelivery, setMaxDelivery] = useState('');
  const [minRating, setMinRating] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sort, setSort] = useState('');
  const [filterLoading, setFilterLoading] = useState(false);
  const [loading, setLoading] = useState(initialLoading || false);

  const allowedTags = [
    "intro", "outro", "logo animation", "color grading", "transitions",
    "captions", "subtitles", "sound design", "green screen", "motion graphics",
    "vfx", "slow motion", "timelapse", "3D", "2D animation",
    "voiceover sync", "storyboarding", "youtube", "instagram", "tiktok",
    "wedding", "gaming", "vlog", "product demo", "commercial", "corporate"
  ];

  const categories = [
    'music-video-editing',
    'wedding-event-editing',
    'commercial-ad-editing',
    'youtube-vlog-editing',
    'gaming-editing',
    'podcast-editing',
    'short-form-reels-shorts',
    'faceless-youtube-channel-editing',
    'corporate-educational-editing'
  ].map(slug => ({
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: slug
  }));

  // Dropdown options
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat.value, label: cat.name }))
  ];

  const deliveryOptions = [
    { value: '', label: 'Any Delivery' },
    { value: '1', label: 'Up to 1 day' },
    { value: '3', label: 'Up to 3 days' },
    { value: '7', label: 'Up to 7 days' },
    { value: '14', label: 'Up to 14 days' }
  ];

  const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '4', label: '4★ & above' },
    { value: '4.5', label: '4.5★ & above' },
    { value: '4.8', label: '4.8★ & above' }
  ];

  const sortOptions = [
    { value: '', label: 'Relevance' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' }
  ];


  const { gigs , setGigs , getAllGigs }= useAppContext();
  const {user} = useAuth();
  useEffect(() => {
    if (getAllGigs) {
      getAllGigs();
    }
  }, []);

  const applyFilters = async () => {
    setFilterLoading(true);
    try {
      console.log("inside filter function")
      const params = new URLSearchParams();
      if (selectedCategory) params.set('category', selectedCategory);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (maxDelivery) params.set('maxDelivery', maxDelivery);
      if (minRating) params.set('minRating', minRating);
      if (selectedTags.length) params.set('tags', selectedTags.join(','));
      if (sort) params.set('sort', sort);
       console.log('🧪 Filter data:', {
      selectedCategory,
      minPrice,
      maxPrice,
      maxDelivery,
      minRating,
      selectedTags,
      sort
    });
    console.log('🌐 Request URL:', `/api/gigs/filter?${params.toString()}`);


      const res = await fetch(`/api/gigs/filter?${params.toString()}`);
      const data = await res.json();
      console.log(data , "data");
      
      if (data.success) {
        setGigs(data.gigs);
      }
      
      setShowMobileFilters(false); // Close mobile drawer after applying
    } catch (error) {
      console.error('Error applying filters:', error);
    }
    setFilterLoading(false);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setMaxDelivery('');
    setMinRating('');
    setSelectedTags([]);
    setSort('');
    setSearchQuery('');
    if (getAllGigs) {
      getAllGigs();
    }
    setShowMobileFilters(false); // Close mobile drawer after clearing
  };

  const handleTagChange = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const handleScrollRight = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  }, []);

  const handleScrollLeft = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  }, []);
const router = useRouter();
  const handleClick = (gig) => {
    const slug = createSlug(gig.title);
  console.log('Navigate to gig:', slug, gig._id);
  router.push(`/categories/${slug}/${gig._id}`);
    // Add your navigation logic here
  };

  const filteredGigs = gigs?.filter(gig => {
    if (!searchQuery) return true;
    return gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           gig.description.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  const activeFiltersCount = [selectedCategory, minPrice, maxPrice, maxDelivery, minRating, ...selectedTags].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handleScrollLeft}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto mx-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex gap-8 text-sm font-medium whitespace-nowrap py-1">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`text-gray-600 hover:text-blue-600 transition-colors duration-200 relative group py-2 ${
                    selectedCategory === category.value ? 'text-blue-600' : ''
                  }`}
                >
                  {category.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                    selectedCategory === category.value ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleScrollRight}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Welcome back, {user?.name || "User"}
              </h1>
              <p className="text-blue-100 text-lg">Discover amazing gigs and grow your business</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-blue-200 text-sm">Professional Video Editing Services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search gigs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filter Toggle and View Mode */}
            <div className="flex items-center gap-3">
              {/* Desktop Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`hidden lg:flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  showFilters ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className={`lg:hidden flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeFiltersCount > 0 ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown - Desktop Only */}
              <div className="hidden lg:flex items-center gap-3">
                <span className="text-sm text-gray-500 font-medium">Sort by:</span>
                <div className="min-w-[150px]">
                  <CustomDropdown
                    value={sort}
                    onChange={setSort}
                    options={sortOptions}
                    placeholder="Relevance"
                  />
                </div>
              </div>

              <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Filters Panel */}
      {showFilters && (
        <div className="hidden lg:block bg-white border-b border-gray-200 shadow-lg">
          <FilterContent
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            maxDelivery={maxDelivery}
            setMaxDelivery={setMaxDelivery}
            minRating={minRating}
            setMinRating={setMinRating}
            selectedTags={selectedTags}
            handleTagChange={handleTagChange}
            sort={sort}
            setSort={setSort}
            applyFilters={applyFilters}
            clearFilters={clearFilters}
            filterLoading={filterLoading}
            categoryOptions={categoryOptions}
            deliveryOptions={deliveryOptions}
            ratingOptions={ratingOptions}
            sortOptions={sortOptions}
            allowedTags={allowedTags}
            activeFiltersCount={activeFiltersCount}
          />
        </div>
      )}

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer 
        isOpen={showMobileFilters} 
        onClose={() => setShowMobileFilters(false)}
      >
        <FilterContent
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          maxDelivery={maxDelivery}
          setMaxDelivery={setMaxDelivery}
          minRating={minRating}
          setMinRating={setMinRating}
          selectedTags={selectedTags}
          handleTagChange={handleTagChange}
          sort={sort}
          setSort={setSort}
          applyFilters={applyFilters}
          clearFilters={clearFilters}
          filterLoading={filterLoading}
          categoryOptions={categoryOptions}
          deliveryOptions={deliveryOptions}
          ratingOptions={ratingOptions}
          sortOptions={sortOptions}
          allowedTags={allowedTags}
          activeFiltersCount={activeFiltersCount}
          isMobile={true}
        />
      </MobileFilterDrawer>

      {/* Gigs Section */}
      <div className="container mx-auto px-6 py-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedCategory ? `${selectedCategory.replace(/-/g, ' ')} Gigs` : 'Featured Gigs'}
              </h2>
              <p className="text-gray-600">
                {filteredGigs.length} {filteredGigs.length === 1 ? 'gig' : 'gigs'} found
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-500">Loading amazing gigs...</p>
            </div>
          </div>
        )}

        {/* Gigs Grid/List */}
        {!loading && filteredGigs.length > 0 && (
          <div className="relative">
            <div className={`transition-all duration-500 ${showAll ? "max-h-full" : "max-h-[2000px] overflow-hidden"}`}>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {filteredGigs.map((gig) => (
                    <GigCard
                      key={gig._id}
                      gig={gig}
                      onClick={() => handleClick(gig)}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredGigs.map((gig) => (
                    <GigCard
                      key={gig._id}
                      gig={gig}
                      onClick={() => handleClick(gig)}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Show More/Less Button */}
            {filteredGigs.length > 10 && (
              <div className="mt-12 text-center relative">
                {!showAll && (
                  <div className="absolute inset-x-0 -top-16 h-16 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
                )}
                <div className="bg-gray-50 pt-8 pb-4">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-blue-300 px-8 py-4 rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow-md group"
                  >
                    {showAll ? (
                      <>
                        <span>Show Less Gigs</span>
                        <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                      </>
                    ) : (
                      <>
                        <span>Show More Gigs</span>
                        <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredGigs.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No gigs found</h3>
              <p className="text-gray-600 mb-8">
                {searchQuery || selectedCategory || selectedTags.length > 0
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Be the first to post a gig in this category and start earning!"
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {(searchQuery || selectedCategory || selectedTags.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Post Your Gig
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GigCategories;