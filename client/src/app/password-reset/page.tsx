'use client';

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function PasswordReset() {

   const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
   const [codeExpirationTimeRemaining, setCodeExpirationTimeRemaining] = useState(300);

   useEffect(() => {
      let countdownInterval: NodeJS.Timeout;

      if (isVerificationCodeSent) {
         countdownInterval = setInterval(() => {
            setCodeExpirationTimeRemaining((prevTimeInSeconds) => {
               if (prevTimeInSeconds === 0) {
                  clearInterval(countdownInterval);
                  setIsVerificationCodeSent(false);
                  return 0;
               } else {
                  return prevTimeInSeconds - 1;
               }
            });
         }, 1000);
      }

      return () => {
         clearInterval(countdownInterval);
      }
   }, [isVerificationCodeSent]);

   const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
      return `${formattedMinutes}:${formattedSeconds}`;
   }

   const sendNewPasswordData = async (data: FormData) => {
      const username = data.get('username')?.valueOf().toString().trim();
      const newPassword = data.get('password')?.valueOf().toString().trim();
      const confirmedPassword = data.get('confirmPassword')?.valueOf().toString().trim();

      if (newPassword !== confirmedPassword) {
         alert("Please confirm the correct password");
         return;
      }

      const SERVER_DOMAIN = process.env.SERVER_DOMAIN;
      const response = await fetch(`${SERVER_DOMAIN}/users/password-reset/new-password`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            username,
            newPassword
         })
      });

      if (!response.ok) {
         const responseMessage = await response.json();
         alert(responseMessage.message);
      } else {
         setIsVerificationCodeSent(true);
      }
   }

   const sendVerificationData = async (data: FormData) => {
      const username = data.get('username')?.valueOf().toString().trim();
      const verificationCode = data.get('verificationCode')?.valueOf().toString().trim();
      const SERVER_DOMAIN = process.env.SERVER_DOMAIN;

      const response = await fetch(`${SERVER_DOMAIN}/users/password-reset/verification`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            username,
            verificationCode
         })
      });

      if (!response.ok) {
         const responseMessage = await response.json();
         alert(responseMessage.message);
      } else {
         setIsVerificationCodeSent(false);
         redirect('/login')
      }
   }

   return (
      <div className="flex flex-col gap-2">
         <h1 className="text-center border rounded-2xl text-3xl p-3">Password Reset</h1>
         <form action={isVerificationCodeSent ? sendVerificationData : sendNewPasswordData} className="flex flex-col border rounded-2xl gap-8 p-10 w-96">
            <div className="flex flex-col gap-2">
               <label className="text-lg" htmlFor="username">Username</label>
               <input required className="bg-transparent border p-2 text-base rounded-md" id="username" name="username" type="text" />
            </div>
            {
               isVerificationCodeSent ?
                  <div className="flex flex-col gap-2">
                     <label className="text-lg" htmlFor="verificationCode">Verification Code</label>
                     <input required className="bg-transparent border p-2 text-base rounded-md" id="verificationCode" name="verificationCode" type="text" />
                  </div>
                  :
                  <>
                     <div className="flex flex-col gap-2">
                        <label className="text-lg" htmlFor="password">Password</label>
                        <input required className="bg-transparent border p-2 text-base rounded-md" id="password" name="password" type="password" />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-lg" htmlFor="confirmPassword">Confirm Password</label>
                        <input required className="bg-transparent border p-2 text-base rounded-md" id="confirmPassword" name="confirmPassword" type="password" />
                     </div>
                  </>
            }
            <div className="flex justify-around gap-4">
               <button
                  className="border py-2 w-full text-lg rounded-md hover:bg-slate-100 hover:text-slate-800 transition"
                  type="submit"
               >{isVerificationCodeSent ? 'Verify' : 'Confirm'}</button>
               <button
                  className="border py-2 w-full text-lg rounded-md hover:bg-slate-100 hover:text-slate-800 transition"
                  type="reset"
               >Clear</button>
            </div>
            {
               isVerificationCodeSent &&
               <p className="text-right text-slate-300">Time remaining: {formatTime(codeExpirationTimeRemaining)}</p>
            }
         </form>
      </div>
   );
}