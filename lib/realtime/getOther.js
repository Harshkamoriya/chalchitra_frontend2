import api from "../axios";

const getOtherUser = async (conversationParticipants, currentUserId) => {
  // find receiverId
  const receiver = conversationParticipants.find(p => p._id !== currentUserId);
  const receiverId = receiver?._id;
  console.log("[getOtherUser] receiverId:", receiverId);

  if (!receiverId) {
    console.warn("[getOtherUser] receiverId not found from participants");
    return null;
  }

  try {
    const res = await api.get('/api/receiver', { params: { receiverId } });
    console.log("[getOtherUser] API response:", res.data);

    if (res.data.success) {
      return res.data.receiver;
    } else {
      console.warn("[getOtherUser] Receiver not found or request failed");
      return null;
    }
  } catch (error) {
    console.error("[getOtherUser] Error finding receiver:", error.message);
    return null;
  }
};

export default getOtherUser;
