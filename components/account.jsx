"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import axios from "axios"


// Clean Account Details component
export default function AccountDetails({ formData, updateFormData, prevStep }) {
  const [localData, setLocalData] = useState({
    phoneNumber: formData.phoneNumber || "",
    phoneVerified: formData.phoneVerified || false,
    email: formData.email || "",
    emailVerified: formData.emailVerified || false,
  })

  const [verificationCodes, setVerificationCodes] = useState({
    phone: "",
    email: "",
  })
   const router = useRouter();

  // Handle input changes
  const handleChange = (field, value) => {
    const newData = { ...localData, [field]: value }
    setLocalData(newData)
    updateFormData(newData)
  }

  // const {data: session} = useSession();
  // console.log(session)
  // const username = session?.user?.name
  // console.log(username , "username");

//send verification code
  const sendVerificationCode = async (type) => {
  const identifier = type === "phone" ? localData.phoneNumber : localData.email

  try {
    const res = await fetch("/api/verify/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, type }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Failed to send code")
    alert(`${type} code sent successfully!`)
  } catch (err) {
    alert(err.message)
  }
}


// verify code 
const verifyCode = async (type) => {
  const identifier = type === "phone" ? localData.phoneNumber : localData.email
  const code = verificationCodes[type]

  try {
    const res = await fetch("/api/verify/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, type, code }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Verification failed")

    handleChange(`${type}Verified`, true)
    toast.success(`${type} verified successfully`)
    alert(`${type} verified successfully!`)
  } catch (err) {
    alert(err.message)
  }
}


  // Send verification code
  // const sendVerificationCode = (type) => {
  //   alert(`Verification code sent to your ${type}!`)
  // }

  // Verify code
  // const verifyCode = (type) => {
  //   if (verificationCodes[type].length === 6) {
  //     handleChange(`${type}Verified`, true)
  //     alert(`${type.charAt(0).toUpperCase() + type.slice(1)} verified successfully!`)
  //   } else {
  //     alert("Please enter a valid 6-digit code")
  //   }
  // }

  // Handle form submission
  console.log(localData.phoneNumber)
useEffect(() => {
  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const res = await axios.get("/api/user/account_security", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.data.success) {
        const data = res.data.user;   // assuming you return { success, user }

        const newData = {
          phoneNumber: data.phoneNumber || "",
          phoneVerified: data.phoneVerified || false,
          email: data.email || "",
          emailVerified: data.emailVerified || false,
        };

        setLocalData(newData);
        updateFormData(newData); // keep parent in sync
      } else {
        console.error("Failed to fetch account security info:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching account security info:", error);
    }
  };

  fetchData();
}, []);


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!localData.phoneVerified || !localData.emailVerified) {
    alert("Please verify both phone and email before proceeding.");
    return;
  }

  try {
    console.log("inside handleSubmit");
    const token = sessionStorage.getItem("accessToken");

    const res = await axios.patch(
      "/api/user/account_security",
      {
        phoneNumber: localData.phoneNumber,
        phoneVerified: true,
        emailVerified: true,
      },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Axios automatically parses JSON → data is in res.data
    console.log("Response:", res.data);

    toast.success("Profile setup completed successfully");
    router.push("/seller/manage/gigs/create_gig");
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};



  return (
    <div className="lg:px-12">
      {/* Header section */}
      <div className="mb-12 ">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-700 mb-4">Account Security</h1>
            <p className="text-gray-600 max-w-2xl leading-relaxed">
              Secure your account with verified contact information and complete your professional setup.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 italic">* Mandatory fields</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Phone Number */}
        <div className="space-y-4">
          <label className="text-md font-medium text-gray-700">Phone Number*</label>
          <div className="flex space-x-3">
            <Input
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={localData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              required
              className="flex-1 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
            <Button
              type="button"
              onClick={() => sendVerificationCode("phone")}
              disabled={!localData.phoneNumber || localData.phoneVerified}
              className={`px-6 py-3 rounded-lg font-medium ${
                localData.phoneVerified
                  ? "bg-green-600 text-white cursor-default"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {localData.phoneVerified ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>

          {localData.phoneNumber && !localData.phoneVerified && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <p className="text-sm text-blue-800">Enter the 6-digit verification code sent to your phone:</p>
              <div className="flex space-x-3">
                <Input
                  type="text"
                  placeholder="123456"
                  maxLength="6"
                  value={verificationCodes.phone}
                  onChange={(e) => setVerificationCodes((prev) => ({ ...prev, phone: e.target.value }))}
                  className="flex-1 h-10"
                />
                <Button
                  type="button"
                  onClick={() => verifyCode("phone")}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                >
                  Verify
                </Button>
              </div>
            </div>
          )}

          {localData.phoneVerified && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Phone number verified</span>
            </div>
          )}
        </div>

        {/* Email */}
        <div className="space-y-4">
          <label className="text-md font-medium text-gray-700">Email Address*</label>
          <div className="flex space-x-3">
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={localData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              className="flex-1 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
            <Button
              type="button"
              onClick={() => sendVerificationCode("email")}
              disabled={!localData.email || localData.emailVerified}
              className={`px-6 py-3 rounded-lg font-medium ${
                localData.emailVerified
                  ? "bg-green-600 text-white cursor-default"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {localData.emailVerified ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>

          {localData.email && !localData.emailVerified && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <p className="text-sm text-blue-800">Enter the 6-digit verification code sent to your email:</p>
              <div className="flex space-x-3">
                <Input
                  type="text"
                  placeholder="123456"
                  maxLength="6"
                  value={verificationCodes.email}
                  onChange={(e) => setVerificationCodes((prev) => ({ ...prev, email: e.target.value }))}
                  className="flex-1 h-10"
                />
                <Button
                  type="button"
                  onClick={() => verifyCode("email")}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                >
                  Verify
                </Button>
              </div>
            </div>
          )}

          {localData.emailVerified && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Email address verified</span>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-amber-800 mb-2">Account Security</h4>
          <p className="text-sm text-amber-700">
            Verifying your phone number and email helps secure your account and enables important notifications about
            your services.
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-8 border-t border-gray-200">
          <Button
            type="button"
            onClick={prevStep}
            variant="outline"
            className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg"
          >
            Previous
          </Button>
        <Button
            type="submit"
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Complete Setup
          </Button>
        </div>
      </form>
    </div>
  )
}
