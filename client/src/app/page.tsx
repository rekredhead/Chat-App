'use client';
import { useEffect, useState } from "react";
import io, { Socket } from 'socket.io-client';
import Link from "next/link";
import Image from "next/image";
import 'material-icons/iconfont/material-icons.css';

interface messagesData {
   id: string;
   text: string;
}

export default function Home() {
   const SERVER_DOMAIN = process.env.SERVER_DOMAIN;

   const [isMenuExpanded, setIsMenuExpanded] = useState(false);
   /*
   const [messages, setMessages] = useState<messagesData[]>([]);
   const [socket, setSocket] = useState<Socket | null>(null);

   // Only establish the websocket connection once after the page load
   useEffect(() => {
      const newSocket = io(`ws${SERVER_DOMAIN?.substring(4)}`);
      setSocket(newSocket);

      return () => {
         newSocket.disconnect();
      }
   }, []);

   // Listen for message events from the server and update the messages state
   // Run this everytime a change occurs to the socket 
   useEffect(() => {
      if (socket) {
         socket.on('message', (message) => {
            const data = JSON.parse(message);
            setMessages((prevMessages) => [...prevMessages, data]);
         });
      }
   }, [socket]);

   const handleSubmit = async (data: FormData) => {
      if (!socket) {
         alert("Socket is null. Cannot send the message");
         return;
      }
      
      const text = data.get('myMessage')?.valueOf().toString().trim();
      if (!text) return;

      socket.emit('message', text);
   }
   */
   return (
      <div className="w-screen h-screen">
         <header className="flex fixed items-center justify-between px-3 bg-slate-900 top-0 left-0 right-0 h-16">
            <div className="flex items-center gap-3">
               <button
                  onClick={() => setIsMenuExpanded(prevState => !prevState)}
                  className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-slate-700 active:bg-slate-600 transition"
               >
                  <span className="material-icons">menu</span>
               </button>
               <p className="text-3xl">Chat Hall</p>
            </div>
            <div className="flex items-center gap-3">
               <Link
                  title="Profile"
                  href="/profile"
                  className="h-10 w-10 rounded-full overflow-hidden"
               >
                  <Image
                     src="/kehan.png"
                     alt="Kehan PFP"
                     width={0}
                     height={0}
                     sizes="100vw"
                     style={{ width: '100%', height: '100%' }}
                  />
               </Link>
            </div>
         </header>
         <nav className={`flex flex-col fixed items-center py-2 gap-2 bg-slate-900 top-16 left-0 bottom-0 w-auto px-3 overflow-y-scroll`}>
            {
               [0, 1, 2, 3, 4].map((item, index) => {
                  return (
                     <div className="flex items-center gap-2">
                        <div key={index} className="h-10 w-10 rounded-full overflow-hidden">
                           <Image
                              src="/kehan.png"
                              alt="Kehan PFP"
                              width={0}
                              height={0}
                              sizes="100vw"
                              style={{ width: '100%', height: '100%' }}
                           />
                        </div>
                        { isMenuExpanded && <p className="text-sm">Testusername</p> }
                     </div>
                  );
               })
            }
         </nav>
         {/*
         <h1>Message board</h1>
         <div className="border w-1/2 h-1/2 mb-5">
            {messages.map((message, index) => (
               <div key={index}>
                  <p>{`${message.id}: ${message.text}`}</p>
               </div>
            ))}
         </div>
         <form className="flex flex-col w-1/2" action={handleSubmit}>
            <input className="text-black p-2" name="myMessage" type="text" />
            <button type="submit">Send</button>
         </form>
         */}
         {/*
         <main className="flex flex-col items-center h-screen w-screen px-5">
            <div className="border flex flex-col h-[90%] w-full p-1 gap-2 overflow-y-scroll">
               <div className="p-2 rounded-md text-lg w-fit bg-blue-600 self-end">Hi</div>
               <div className="p-2 rounded-md text-lg w-fit bg-green-600 self-start">Hello</div>
               <div className="p-2 rounded-md text-lg w-fit bg-orange-600 self-center">Notification 1</div>
            </div>
            <form className="border flex justify-center items-center h-[10%] w-full">
               <input className="w-4/5 p-1 rounded-md bg-transparent border" type="text" />
               <button className="p-1 rounded-md border w-auto active:opacity-50" type="submit">Enter</button>
               <button className="p-1 rounded-md border w-auto active:opacity-50" type="reset">Clear</button>
            </form>
         </main>
         */}
      </div>
   );
}
