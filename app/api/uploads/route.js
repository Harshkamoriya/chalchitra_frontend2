// import { Readable } from 'stream';
// import { NextResponse } from 'next/server';

// import { unstable_noStore as noStore } from 'next/cache';
// import upload from '@/lib/multer_cloudinart';

// export const config ={
//     api:{
//         bodyParser : false,
//     }
// }

// function streamToReq(stream , req){
//     return new Promise((resolve , reject)=>{
//         req.headers = stream.headers;
//         req.method = stream.method;
//         req.url = stream.url;

//         const readable = Readable.from(stream);
//         readable.on('error', reject)
//         resolve(readable);

//     });


// }

// export async function POST(req){
//     noStore();

//     const formData = await new Promise((resolve , reject)=>{
//         upload(req ,{}, (err)=>{
//             if(err)reject(err);
//             resolve(req);
//         });
//     });

//     try {
//     const coverImageUrl = req.files?.coverImage?.[0]?.path || '';
//     const galleryUrls = req.files?.gallery?.map(file => file.path) || [];
//     const videoUrl = req.files?.video?.[0]?.path || '';

//     return NextResponse.json({
//       coverImageUrl,
//       galleryUrls,
//       videoUrl,
//     });
//   } catch (error) {
//     console.error('Upload failed:', error);
//     return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
//   }

    
// }

// app/api/upload/route.js

import { Readable } from 'stream';
 import { NextResponse } from 'next/server';

 import upload from '@/lib/multer_cloudinart';

// Disable caching
export const dynamic = "force-dynamic";

function toNodeReadable(stream) {
  return Readable.from(stream);
}

export async function POST(req) {
  try {
    const readable = toNodeReadable(req.body);
    const boundary = req.headers.get("content-type").split("boundary=")[1];

    const reqWithBody = {
      ...req,
      headers: Object.fromEntries(req.headers),
      method: req.method,
      url: req.url,
    };

    // Assign readable body to mimic Express request
    Object.assign(reqWithBody, { pipe: readable.pipe.bind(readable) });

    // Wait for Multer to parse the multipart form
    const result = await new Promise((resolve, reject) => {
      upload.fields([
         { name: "profileImage", maxCount: 1 }, // ✅ add this line
        { name: "coverImage", maxCount: 1 },
        { name: "gallery", maxCount: 5 },
        { name: "video", maxCount: 1 },
      ])(reqWithBody, {}, (err) => {
        if (err) return reject(err);
        resolve(reqWithBody);
      });
    });
    
    const profileImageUrl = result.files?.profileImage?.[0]?.path || '';
    const coverImageUrl = result.files?.coverImage?.[0]?.path || "";
    const galleryUrls = result.files?.gallery?.map((file) => file.path) || [];
    const videoUrl = result.files?.video?.[0]?.path || "";

    return NextResponse.json({ profileImageUrl , coverImageUrl, galleryUrls, videoUrl });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
