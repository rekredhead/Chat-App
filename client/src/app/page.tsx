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

function Header({ onClick }: any) {
   return (
      <header className="flex fixed items-center justify-between px-3 bg-slate-900 top-0 left-0 right-0 h-16">
         <div className="flex items-center gap-3">
            <button
               onClick={onClick}
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
   );
}

function NavBar({ isMenuExpanded }: any) {
   return (
      <nav className={`flex flex-col items-center mt-16 py-2 px-3 gap-2 bg-slate-900 w-auto overflow-y-scroll`}>
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
                     {isMenuExpanded && <p className="text-sm">Testusername</p>}
                  </div>
               );
            })
         }
      </nav>
   );
}

export default function Home() {
   const SERVER_DOMAIN = process.env.SERVER_DOMAIN;

   const [isMenuExpanded, setIsMenuExpanded] = useState(false);
   const [messages, setMessages] = useState<messagesData[]>([]);
   const [socket, setSocket] = useState<Socket | null>(null);

   const toggleMenu = () => setIsMenuExpanded(prevState => !prevState);

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

   return (
      <div className="w-screen h-screen">
         <Header onClick={toggleMenu} />
         <div className="double-grid w-full h-full">
            <NavBar isMenuExpanded={isMenuExpanded} />
            <main className="flex relative mt-16">
               <div className="flex flex-col absolute top-0 left-0 right-0 bottom-24 p-5 gap-2 border">
                  <p className="p-2 rounded-md text-lg w-fit bg-blue-600 self-end">Hi</p>
                  <p className="p-2 rounded-md text-lg w-fit bg-green-600 self-start">Hello</p>
                  <p className="p-2 rounded-md text-lg w-fit bg-orange-600 self-center">Notification 1</p>
               </div>
               <form className="flex absolute justify-center py-2 bottom-8 left-0 right-0 gap-2" action={handleSubmit}>
                  <input
                     className="bg-slate-700 p-4 text-base rounded-md w-1/2 outline-none"
                     name="text"
                     type="text"
                     autoFocus={true}
                     placeholder="Send a message"
                  />
                  <button className="p-4 rounded-md bg-green-600 hover:opacity-80" type="submit">Send</button>
                  <button className="p-4 rounded-md bg-red-600 hover:opacity-80" type="reset">Cancel</button>
               </form>
            </main>
         </div>
      </div>
   );
}
