import React from "react";
import { Button } from "@/components/ui/button";
import { FaArrowDown, FaArrowRight, FaClock, FaRupeeSign } from "react-icons/fa";

// Server-side fetch
async function getGigById(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/gigs/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch gig");
  const data = await res.json();
  return data.gig;
}

const Page = async ({ params }) => {
  const { id } = params;
  const gig = await getGigById(id);

  return (
    <div className="main flex flex-col md:flex-row md:justify-between w-full h-full gap-10 py-10 px-5 md:px-20">
      {/* Left Side */}
      <div className="left w-full md:w-2/3 space-y-6">
        <div className="header space-y-2">
          <p className="text-sm text-gray-500">{gig.title}</p>
          <h1 className="text-3xl font-semibold text-gray-800">{gig.description}</h1>
        </div>
        <div className="slider-box w-full rounded-lg overflow-hidden border border-gray-200">
          <img src={gig.media.coverImage} alt={gig.title} className="w-full h-[400px] object-cover" />
        </div>
      </div>

      {/* Right Side - Sticky */}
      <div className="right w-full md:w-1/3 h-fit sticky top-24 border border-gray-200 rounded-xl shadow-sm bg-white">
        {/* Package Tabs */}
        <div className="flex">
          {["Basic", "Standard", "Premium"].map((pkg, idx) => (
            <div
              key={idx}
              className="flex-1 text-center py-3 text-gray-600 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
            >
              {pkg}
            </div>
          ))}
        </div>

        {/* Gig Details */}
        <div className="p-6 space-y-4">
          <div className="flex items-center text-xl font-bold text-gray-800">
            <FaRupeeSign className="mr-1" /> {gig.packages.price}
          </div>
          <p className="text-gray-700 text-base">Save up to 15% with Subscribe to Save</p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">LOGO + STATIONERY DESIGN</span> ✔ Full Logo Design Basic Package ✔ Stationery Design
            (Business card, Letterhead and Envelope)
          </p>

          {/* Features */}
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaClock />
              <span>5-day delivery</span>
            </div>
            <p>✔ Logo transparency</p>
            <p>✔ Vector file</p>
            <p>✔ Printable file</p>
            <p>✔ Include 3D mockup</p>
            <p>✔ Include source file</p>
          </div>

          {/* Buttons */}
          <div className="pt-4 space-y-3">
            <Button className="w-full bg-gray-900 text-white font-semibold text-lg flex justify-center items-center gap-2">
              Continue <FaArrowRight />
            </Button>
            <Button variant="outline" className="w-full text-lg flex justify-center items-center gap-2">
              Contact me <FaArrowDown />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
