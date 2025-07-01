"use server"

import { redirect } from "next/navigation"

export async function createGig(formData) {
  try {
    // Extract form data
    const gigData = {
      title: formData.get("title"),
      category: formData.get("category"),
      description: formData.get("description"),
      tags: JSON.parse(formData.get("tags") || "[]"),

      // Service details
      editingStyles: formData.getAll("editingStyles"),
      resolutions: formData.getAll("resolutions"),
      formats: formData.getAll("formats"),
      maxDuration: formData.get("maxDuration"),
      uniqueFeatures: formData.getAll("uniqueFeatures"),

      // Pricing
      packages: {
        basic: {
          price: Number.parseFloat(formData.get("basicPrice")),
          deliveryTime: formData.get("basicDeliveryTime"),
          revisions: formData.get("basicRevisions"),
          features: formData.get("basicFeatures"),
          rushDelivery: formData.get("basicRushDelivery") === "on",
        },
        standard: {
          price: Number.parseFloat(formData.get("standardPrice")),
          deliveryTime: formData.get("standardDeliveryTime"),
          revisions: formData.get("standardRevisions"),
          features: formData.get("standardFeatures"),
          rushDelivery: formData.get("standardRushDelivery") === "on",
        },
        premium: {
          price: Number.parseFloat(formData.get("premiumPrice")),
          deliveryTime: formData.get("premiumDeliveryTime"),
          revisions: formData.get("premiumRevisions"),
          features: formData.get("premiumFeatures"),
          rushDelivery: formData.get("premiumRushDelivery") === "on",
        },
      },

      // Portfolio
      portfolioDescription: formData.get("portfolioDescription"),

      // Requirements
      buyerRequirements: formData.get("buyerRequirements"),
      questionsForBuyer: formData.get("questionsForBuyer"),
      additionalRequirements: formData.getAll("additionalRequirements"),

      // Metadata
      sellerId: "current-user-id", // This should come from authentication
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Validate required fields
    if (!gigData.title || !gigData.category || !gigData.description) {
      throw new Error("Missing required fields")
    }

    if (!gigData.packages.basic.price || !gigData.packages.basic.deliveryTime) {
      throw new Error("Basic package pricing is required")
    }

    // Here you would typically save to your database
    // For now, we'll simulate the database operation
    console.log("Creating gig with data:", gigData)

    // Simulate database save
    const savedGig = await saveGigToDatabase(gigData)

    // Redirect to success page or gig management
    redirect(`/seller/gigs/${savedGig.id}`)
  } catch (error) {
    console.error("Error creating gig:", error)
    // In a real app, you'd handle this error appropriately
    throw new Error("Failed to create gig. Please try again.")
  }
}

// Simulated database function
async function saveGigToDatabase(gigData) {
  // This would be replaced with actual database logic
  // For example, using Prisma, Supabase, or another database solution

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "gig_" + Date.now(),
        ...gigData,
      })
    }, 1000)
  })
}

export async function saveDraft(formData) {
  // Similar to createGig but saves as draft
  try {
    const draftData = {
      // Extract same data as createGig
      status: "draft",
      // ... other fields
    }

    console.log("Saving draft:", draftData)

    // Save to database with draft status
    // redirect('/seller/drafts')
  } catch (error) {
    console.error("Error saving draft:", error)
    throw new Error("Failed to save draft")
  }
}
