import { Readable } from 'stream';
import { NextResponse } from 'next/server';

import { unstable_noStore as noStore } from 'next/cache';
import upload from '@/lib/multer_cloudinart';

export const config ={
    api:{
        bodyParser : false,
    }
}

function streamToReq(stream , req){
    return new Promise((resolve , reject)=>{
        req.headers = stream.headers;
        req.method = stream.method;
        req.url = stream.url;

        const readable = Readable.from(stream);
        readable.on('error', reject)
        resolve(readable);

    });


}

export async function POST(req){
    noStore();

    const formData = await new Promise((resolve , reject)=>{
        upload(req ,{}, (err)=>{
            if(err)reject(err);
            resolve(req);
        });
    });

    try {
    const coverImageUrl = req.files?.coverImage?.[0]?.path || '';
    const galleryUrls = req.files?.gallery?.map(file => file.path) || [];
    const videoUrl = req.files?.video?.[0]?.path || '';

    return NextResponse.json({
      coverImageUrl,
      galleryUrls,
      videoUrl,
    });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }

    
}