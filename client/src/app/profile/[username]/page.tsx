'use client';
import { useState, useEffect } from "react";
import Image from 'next/image';

export default function Page({ params }: { params: { username: string } }) {
   const [profileData, setProfileData] = useState({ username: '', bio: '' });
   const SERVER_DOMAIN = process.env.SERVER_DOMAIN;

   useEffect(() => {
      const fetchData = async () => {
         const response = await fetch(`${SERVER_DOMAIN}/profiles/users/:${params.username}`);
         const responseMessage = await response.json();

         !response.ok ? alert(responseMessage.message) : setProfileData(responseMessage);
      }
      fetchData();
   });

   return (
      <div className="flex flex-col gap-2">
         <h1 className="text-center border rounded-2xl text-3xl p-3">Profile</h1>
         <div className="flex flex-col border rounded-2xl gap-8 p-10 w-96">
            <div className="flex justify-center">
               <div className="border aspect-square w-5/6 rounded-full overflow-hidden">
                  {profileData.username &&
                     <Image
                        src={`${SERVER_DOMAIN}/${profileData.username}.png`}
                        alt={`${profileData.username} PFP`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: '100%', height: '100%' }}
                     />}
               </div>
            </div>
            <div className="flex flex-col gap-2">
               <label className="text-lg" htmlFor="username">Username</label>
               <input disabled className="bg-slate-700 p-2 text-base rounded-md" name="username" type="text" defaultValue={profileData.username} />
            </div>
            <div className="flex flex-col gap-2">
               <label className="text-lg" htmlFor="bio">Bio</label>
               <textarea disabled className="bg-slate-700 p-2 text-base rounded-md" name="bio" defaultValue={profileData.bio} />
            </div>
         </div>
      </div>
   );
}