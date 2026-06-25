import { useEffect, useState } from "react";
import axios from "axios";

function UserProfile() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const getUser = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        );

        setUser(response.data);

      } catch(error){

        console.log(error);

      }

    };

    getUser();

  }, []);


  if(!user){
    return null;
  }


  return (

    <div className="bg-white/10 backdrop-blur-lg p-5 rounded-3xl mb-6 text-white">

      <div className="w-14 h-14 rounded-full bg-pink-300 flex items-center justify-center text-2xl mb-3">
        👤
      </div>

      <h2 className="font-bold text-lg">
        {user.name}
      </h2>

      <p className="text-sm opacity-80">
        Event Manager
      </p>

      <p className="text-xs mt-2 opacity-70">
        {user.email}
      </p>

    </div>

  );

}

export default UserProfile;