'use client';
import { redirect } from "next/navigation";

export default function Registration() {
   
   const registerUser = async(data: FormData) => {
      const username = data.get('username')?.valueOf().toString().trim();
      const emailAddress = data.get('email')?.valueOf().toString().trim();
      const password = data.get('password')?.valueOf().toString().trim();
      const confirmedPassword = data.get('confirmPassword')?.valueOf().toString().trim();
      const SERVER_DOMAIN = process.env.SERVER_DOMAIN;
      
      if (password !== confirmedPassword) {
         alert("Please confirm the correct password");
         return;
      }

      const response = await fetch(`${SERVER_DOMAIN}/users/register`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            username,
            emailAddress,
            password
         })
      });

      if (!response.ok) {
         const responseMessage = await response.json();
         alert(responseMessage.message);
      } else {
         //redirect('/'); - redirect user to login page
         const responseMessage = await response.json(); // Remove these two codes later
         alert(responseMessage.message);
      }
   }

   return (
      <>
         <div className="flex flex-col gap-2">
            <h1 className="text-center border rounded-2xl text-3xl p-3">Registration Form</h1>
            <form action={registerUser} className="flex flex-col border rounded-2xl gap-10 p-10 w-96">
               <div className="flex flex-col gap-2">
                  <label className="text-lg" htmlFor="username">Username</label>
                  <input required className="bg-transparent border p-2 text-base rounded-md" id="username" name="username" type="text" />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-lg" htmlFor="email">Email Address</label>
                  <input required className="bg-transparent border p-2 text-base rounded-md" id="email" name="email" type="email" />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-lg" htmlFor="password">Password</label>
                  <input required className="bg-transparent border p-2 text-base rounded-md" id="password" name="password" type="password" />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-lg" htmlFor="confirmPassword">Confirm Password</label>
                  <input required className="bg-transparent border p-2 text-base rounded-md" id="confirmPassword" name="confirmPassword" type="password" />
               </div>
               <div className="flex justify-around gap-4">
                  <button
                     className="border py-2 w-full text-lg rounded-md hover:bg-slate-100 hover:text-slate-800 transition duration-100"
                     type="submit"
                  >Register</button>
                  <button
                     className="border py-2 w-full text-lg rounded-md hover:bg-slate-100 hover:text-slate-800 transition duration-100"
                     type="reset"
                  >Clear</button>
               </div>
            </form>
         </div>
      </>
   );
}