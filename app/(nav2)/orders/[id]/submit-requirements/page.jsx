"use client";
import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useSocket } from "@/app/(nav2)/context/SocketContext";
const uploadFileToCloudinary = async (file) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_REQUIREMENTS_PRESET;

  console.log("cloudName:", cloudName);
  console.log("uploadPreset:", uploadPreset);
  console.log("file:", file);

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary config");
  }

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", uploadPreset);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: data
    });
    const json = await res.json();
    console.log("Cloudinary response:", json);
    if (json.secure_url) return json.secure_url;
    else throw new Error(json.error?.message || "Upload failed");
  } catch (e) {
    console.error("Cloudinary upload error:", e);
    throw e;
  }
};

export default function AwaitingRequirements({ params }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();

  const submit = async () => {
    if (!file) return toast.error("Upload a file");
    try {
      setLoading(true);
      const url = await uploadFileToCloudinary(file);
      const res = await api.patch(`/api/orders/${params.id}/submit-requirements`, {
        message,
        requirementsFile: url
      });
      if (res.data.success) {
        toast.success("Requirements submitted!");
        const notification = res.data.notification;
        console.log("Emitting newNotification", notification, socket);
        if (socket) socket.emit("newNotification", notification);
        else console.warn("Socket is not connected!");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-xl font-bold mb-4">Submit Requirements</h1>
      <textarea placeholder="Describe requirements" className="border p-2 w-full mb-4"
        value={message} onChange={e => setMessage(e.target.value)} />
      <input type="file" onChange={e => setFile(e.target.files[0])} className="mb-4" />
      <button onClick={submit} disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  )
}
