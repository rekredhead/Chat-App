// DOMAIN/profile - my profile - mutable - editor mode
'use client';
import { useState, useEffect, useRef } from "react";

export default function Profile() {
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [profileData, setProfileData] = useState({ username: '', bio: '' });
   const SERVER_DOMAIN = process.env.SERVER_DOMAIN;

   useEffect(() => {
      const fetchData = async () => {
         const response = await fetch(`${SERVER_DOMAIN}/profiles/me`, {
            method: 'GET',
            credentials: 'include'
         });

         if (!response.ok) {
            alert('Something went wrong when fetching your profile data');
            return;
         }

         const data = await response.json();
         setProfileData(data);
      }
      fetchData();
   }, []);

   const handleProfilePicClick = () => fileInputRef.current?.click();

   const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles?.length) {
         alert("Please select a file");
         return;
      }

      if (!profileData.username) {
         alert("Cannot upload without a username");
         return;
      }

      const formData = new FormData();
      const selectedFile = selectedFiles[0];

      formData.append('picture', selectedFile);
      formData.append('username', profileData.username);

      const response = await fetch(`${SERVER_DOMAIN}/profiles/uploadProfilePicture`, {
         method: 'POST',
         body: formData,
         credentials: 'include'
      });

      alert(response.ok ?
         "Photo uploaded succesfully" :
         "Something went wrong when uploading your photo");
      
      if (!response.ok) {
         const message = await response.json();
         console.log(message);
         
      }
   }

   const updateProfile = async (data: FormData) => {
      const bio = data.get('bio')?.valueOf().toString().trim();

      const response = await fetch(`${SERVER_DOMAIN}/profiles/update`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({ bio }),
         credentials: 'include'
      });

      alert(response.ok ?
         "Your profile has been updated!" :
         "Something went wrong when updating your profile"
      );
   }

   return (
      <div className="flex flex-col gap-2">
         <h1 className="text-center border rounded-2xl text-3xl p-3">Profile</h1>
         <form action={updateProfile} className="flex flex-col border rounded-2xl gap-8 p-10 w-96">
            <div className="flex justify-center">
               <div
                  onClick={handleProfilePicClick}
                  className="border aspect-square w-5/6 rounded-full cursor-pointer"
                  title="Profile Picture"
               >
                  {/* Image here */}
               </div>
               <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={uploadFile}
                  hidden
               />
            </div>
            <div className="flex flex-col gap-2">
               <label className="text-lg" htmlFor="username">Username</label>
               <input disabled className="bg-slate-700 border p-2 text-base rounded-md" name="username" type="text" defaultValue={profileData.username} />
            </div>
            <div className="flex flex-col gap-2">
               <label className="text-lg" htmlFor="bio">Bio</label>
               <textarea className="bg-transparent border p-2 text-base rounded-md" id="bio" name="bio" defaultValue={profileData.bio} maxLength={200} />
            </div>
            <button
               className="border py-2 text-lg rounded-md hover:bg-slate-100 hover:text-slate-800 transition"
               type="submit"
            >Update Profile</button>
         </form>
      </div>
   );
}