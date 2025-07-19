import api from "../axios";

export async function saveGigSection(gigId, sectionData) {
  const url = gigId ? `/api/user/gigs/${gigId}` : `/api/user/gigs`;

  try {
    console.log("inside the savedgi function")
    console.log(sectionData, "sectionData of portfolio")
    console.log(gigId,"gigid")
    const res = gigId
      ? await api.patch(url, sectionData)
      : await api.post(url, sectionData);

    console.log("✅ saveGigSection success:", res.data);
    return res.data.gig;
  } catch (error) {
    console.error("❌ Error in saveGigSection:", error);
    // Axios errors often have error.response.data
    throw new Error(
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Failed to save gig"
    );
  }
}
