"use client";
import Navbar from "@/components/Navbar";
import { Globe, Loader, Loader2, Shuffle, Sparkle, Video } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import Footer from "@/components/Footer";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import VideoRoom from "@/components/VideoRoom";

const socket = io(process.env.NEXT_PUBLIC_URL!, {
  transports: ["websocket","polling"],
});
export default function Home() {
  const [status, setStatus] = useState("idle");
  const [roomId, setRoomId] = useState("");

  const startChat = () => {
    socket.emit("start");
    setStatus("waiting");
  };
  useEffect(() => {
    socket.on("matched", ({ roomId }) => {
      setRoomId(roomId);
      setStatus("chatting");
    });

    socket.on("waiting",()=>{
      setStatus("waiting");
    })

    socket.on("partner_left",()=>{
      window.location.reload();
    })

    return () => {
      socket.off();
    };
  }, []);

  function next() {
    socket.emit("next");
    window.location.reload();
  }

  return (
    <>
      <Navbar show={status !== "chatting"} />
      <main className=" relative min-h-screen w-full bg-linear-to-br from-black via-zinc-900 to-black text-white overflow-hidden">
        <div className=" absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className=" absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

        <AnimatePresence>
          {status === "idle" && (
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              exit={{ y: 40, opacity: 0 }}
              className=" min-h-screen relative z-10 flex flex-col items-center justify-center px-6 text-center"
            >
              <div className=" mb-6 flex items-center justify-center  w-16 h-16 rounded-2xl bg-white/10 border-white/10 border backdrop-blur">
                <Sparkle />
              </div>
              <div className=" text-4xl sm:text-5xl tracking-tight font-bold mb-3">
                BlindTalk
              </div>
              <p className=" max-w-md text-zinc-400 mb-8 text-sm sm:text-base">
                Anonymous video conversation with strangers worldwide. No
                sign-up. No identity .Just pure connection.
              </p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={startChat}
                className=" gap-3 px-8 py-4 rounded-2xl cursor-pointer flex items-center text-black bg-linear-to-r from-white to-zinc-200 font-semibold shadow-xl text-lg"
              >
                <Video size={22} /> Start Anonymous Chat
              </motion.button>
            </motion.div>
          )}

          {status === "waiting" && (
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0 }}
              className=" relative z-10 w-full min-h-screen flex flex-col justify-center items-center gap-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 1.1 }}
              >
                <Loader2 size={56} />
              </motion.div>
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 1.1 }}
              >
                Waiting for someone to join...
              </motion.p>
            </motion.div>
          )}

          {status === "chatting" && roomId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className=" inset-0 flex flex-col fixed bg-black z-20"
            >
              <div className=" flex items-center justify-between px-10 py-4 backdrop-blur border-b border-white/10 bg-black/60">
                <div className=" flex items-center gap-2 text-sm text-zinc-400">
                  <Globe size={16} />
                  Incognito | connected
                </div>
                <motion.button
                onClick={next}
                className="flex items-center gap-2 bg-red-500 rounded-2xl px-3 py-1 font-semibold text-lg">
                  <Shuffle size={16} />
                  Next
                </motion.button>
              </div>
              <VideoRoom roomId={roomId} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
