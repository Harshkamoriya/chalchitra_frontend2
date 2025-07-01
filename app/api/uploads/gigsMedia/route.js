// // import { NextResponse } from "next/server";
// // import formidable from "formidable";
// // import fs from "fs";


// // import cloudinary from "@/lib/cloudinary";
// // export const config = {
// //   api: {
// //     bodyParser: false,
// //   },
// // };
// // export const dynamic = "force-dynamic";

// // export async function POST(req) {
// //   try {
// //     const contentType = req.headers.get("content-type");
// //     const contentLength = req.headers.get("content-length");

// //     const form = formidable({
// //       multiples: true,
// //       keepExtensions: true,
// //     });

// //     console.log("⏳ Parsing form...");
// //     const [fields, files] = await new Promise((resolve, reject) => {
// //       form.parse(
// //         Object.assign(req, {
// //           headers: {
// //             "content-type": contentType,
// //             "content-length": contentLength,
// //           },
// //         }),
// //         (err, fields, files) => {
// //           if (err) reject(err);
// //           else resolve([fields, files]);
// //         }
// //       );
// //     });

// //     console.log("✅ fields:", fields);
// //     console.log("✅ files:", files);

// //     const uploadedUrls = [];

// //     const gallery = Array.isArray(files.gallery) ? files.gallery : [files.gallery];

// //     // ⚡ Upload each file to cloudinary
// //     for (const file of gallery) {
// //       console.log("⏫ Uploading:", file.originalFilename);

// //       const result = await cloudinary.uploader.upload(file.filepath, {
// //         folder: "gigs/gallery",
// //         resource_type: "auto", // auto = images, videos, pdfs
// //       });

// //       uploadedUrls.push(result.secure_url);
// //     }

// //     console.log("✅ Uploaded URLs:", uploadedUrls);

// //     return NextResponse.json({ success: true, galleryUrls: uploadedUrls });
// //   } catch (error) {
// //     console.error("❌ Upload failed:", error);
// //     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
// //   }
// // }

// import { NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";
// import formidable from "formidable";

// // Disable Next.js default body parsing
// export const config = { api: { bodyParser: false } };

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key:    process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(req) {
//   try {
//     console.log("⏳ Parsing form data...");

//     // Parse form-data (multipart) request
//     const form = formidable({ multiples: true, maxFileSize: 100 * 1024 * 1024 });

//     const [fields, files] = await new Promise((resolve, reject) => {
//       form.parse(req, (err, fields, files) => {
//         if (err) reject(err);
//         else resolve([fields, files]);
//       });
//     });

//     console.log("✅ Fields:", fields);
//     console.log("✅ Files:", files);

//     // Files.gallery can be single file or array → normalize to array
//     const gallery = Array.isArray(files.gallery) ? files.gallery : [files.gallery];

//     const uploadedUrls = [];

//     // Upload each file to Cloudinary
//     for (const file of gallery) {
//       console.log("📤 Uploading file:", file.originalFilename);

//       const uploadResult = await cloudinary.uploader.upload(file.filepath, {
//         folder: "gigsGallery",
//         resource_type: "auto", // auto-detect video/image/pdf
//       });

//       uploadedUrls.push(uploadResult.secure_url);
//     }

//     console.log("✅ Uploaded URLs:", uploadedUrls);

//     return NextResponse.json({
//       success: true,
//       uploaded: uploadedUrls,
//     });
//   } catch (err) {
//     console.error("❌ Upload failed:", err);
//     return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import { Readable } from "stream";

// Disable Next.js default body parsing
export const config = { api: { bodyParser: false } };

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to convert Web Request to Node.js Readable
function toNodeReadable(webRequest) {
  return Readable.from(webRequest.body);
}

export async function POST(req) {
  try {
    console.log("⏳ Parsing form data...");

    const form = formidable({ multiples: true, maxFileSize: 100 * 1024 * 1024 });

    // Convert Web Request to Node.js readable stream
    const nodeReq = toNodeReadable(req);
    nodeReq.headers = Object.fromEntries(req.headers);

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    console.log("✅ Fields:", fields);
    console.log("✅ Files:", files);

    // Normalize gallery to array
    const gallery = Array.isArray(files.gallery) ? files.gallery : [files.gallery];

    const uploadedUrls = [];

    for (const file of gallery) {
      console.log("📤 Uploading:", file.originalFilename);
      const upload = await cloudinary.uploader.upload(file.filepath, {
        folder: "gigsGallery",
        resource_type: "auto",
      });
      uploadedUrls.push(upload.secure_url);
    }

    console.log("✅ Uploaded URLs:", uploadedUrls);

    return NextResponse.json({ success: true, uploaded: uploadedUrls });
  } catch (err) {
    console.error("❌ Upload failed:", err);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
