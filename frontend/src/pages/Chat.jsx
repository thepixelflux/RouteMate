import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
  const { rideId } = useParams();
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [ride, setRide] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRideInfo = async () => {
    try {
      const res = await api.get(`/rides/${rideId}`);
      setRide(res.data);
    } catch (err) {
      console.error("Could not fetch ride info:", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${rideId}`);
      setMessages(res.data);
      setError("");
    } catch (err) {
      console.error("Could not fetch chat messages:", err);
      setError("Unable to sync chat history.");
    }
  };

  // Run on mount
  useEffect(() => {
    const initializeChat = async () => {
      setLoading(true);
      await Promise.all([fetchRideInfo(), fetchMessages()]);
      setLoading(false);
    };

    initializeChat();

    // Set up polling interval to pull new messages
    const pollInterval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [rideId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await api.post(`/messages/${rideId}`, { message: newMessage });
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
      setError("Failed to transmit message.");
    }
  };

  if (loading) {
    return (
      <div className="dmrc-panel" style={{ textAlign: "center", padding: "50px" }}>
        <h4>Connecting to Chat Network...</h4>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Navigation */}
      <div style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to={`/ride/${rideId}`} style={{ color: "var(--primary-color)", fontWeight: "bold" }}>
          ← Back to Ride Info
        </Link>
        {ride && (
          <span style={{ fontWeight: "bold", fontSize: "14px", color: "var(--primary-color)" }}>
            ROUTE: {ride.source} → {ride.destination}
          </span>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="dmrc-panel" style={{ padding: 0 }}>
        <div className="dmrc-panel-title" style={{ padding: "15px 20px", margin: 0, borderBottom: "1px solid var(--border-color)" }}>
          <span>Co-riding Discussion Circle</span>
          <span style={{ fontSize: "11px", textTransform: "none", color: "var(--text-muted)" }}>
            Messages refresh automatically
          </span>
        </div>

        {/* Chat window */}
        <div className="chat-window">
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div style={{ textAlign: "center", color: "#888", marginTop: "100px" }}>
                <p>No messages here yet.</p>
                <p style={{ fontSize: "11px" }}>Use this space to coordinate meetup points, delay warnings, or split payments.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMyMessage = msg.sender?._id === user?._id;
                
                return (
                  <div
                    key={msg._id}
                    className={`chat-msg ${isMyMessage ? "chat-msg-outgoing" : "chat-msg-incoming"}`}
                  >
                    {!isMyMessage && (
                      <div className="chat-msg-sender">
                        {msg.sender?.fullName || "Commuter"}
                      </div>
                    )}
                    <div>{msg.message}</div>
                    <div className="chat-msg-time">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form */}
          <form onSubmit={handleSendMessage} className="chat-input-area">
            <input
              type="text"
              className="form-control"
              placeholder="Write a coordinate message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-secondary">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
