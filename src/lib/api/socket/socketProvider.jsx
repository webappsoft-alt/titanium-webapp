import { io } from "socket.io-client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useSelector } from "react-redux";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const newSocket = io('https://api.titanium.com', {
          query: { token },
          reconnection: true,
          reconnectionAttempts: 15, // You can change this to Infinity if needed
          reconnectionDelay: 1000, // Initial delay in ms
          reconnectionDelayMax: 5000, // Max delay in ms
        });

        newSocket.on("connect", () => {
          console.log("Socket connected");
        });

        newSocket.on("authentication", (id) => {
          console.log("Authenticated with ID:", id);
          setSocket(newSocket);
        });

        newSocket.on("disconnect", (reason) => {
          console.warn("Socket disconnected:", reason);
        });

        newSocket.on("reconnect", (attemptNumber) => {
          console.log("Reconnected after", attemptNumber, "attempts");
        });

        newSocket.on("reconnect_error", (error) => {
          console.error("Reconnection error:", error);
        });

        socketRef.current = newSocket;
      } catch (error) {
        console.error("Error initializing socket:", error);
      }
    };

    if (token) {
      initializeSocket();
    } else {
      console.log("No token found for authentication");
    }

    return () => {
      if (socketRef.current) {
        console.log("Disconnecting socket...");
        socketRef.current.disconnect();
      }
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
