import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
function Guests({ darkMode }) {

  const [guests, setGuests] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventName, setEventName] = useState("");
const exportGuestsToExcel = () => {
  const worksheet =
    XLSX.utils.json_to_sheet(guests);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Guests"
  );

  const excelBuffer = XLSX.write(
    workbook,
    {
      bookType: "xlsx",
      type: "array",
    }
  );

  const data = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    }
  );

  saveAs(
    data,
    "Event_Planner_Guests.xlsx"
  );
};

  // Get guests from MongoDB
  useEffect(() => {
    fetchGuests();
  }, []);


  const fetchGuests = async () => {
    try {

      const response = await axios.get(
        "http://localhost:5000/api/guests"
      );

      setGuests(response.data);

    } catch (error) {
      console.log(error);
    }
  };


  // Add guest to MongoDB
  const addGuest = async (e) => {

    e.preventDefault();


    const newGuest = {
      name: guestName,
      email,
      phone,
      eventName,
    };


    try {

      const response = await axios.post(
        "http://localhost:5000/api/guests",
        newGuest
      );


      setGuests([
        ...guests,
        response.data
      ]);


      setGuestName("");
      setEmail("");
      setPhone("");
      setEventName("");


    } catch(error) {

      console.log(error);

    }

  };


  // Delete guest from MongoDB
  const deleteGuest = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/api/guests/${id}`
      );


      setGuests(
        guests.filter(
          (guest) => guest._id !== id
        )
      );


    } catch(error) {

      console.log(error);

    }

  };


  const filteredGuests = guests.filter(
    (guest) =>
      guest.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      guest.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );


  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Guests Management
      </h1>


      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow mb-8">

        <h2 className="text-xl font-bold mb-4">
          Add New Guest
        </h2>


        <form
          onSubmit={addGuest}
          className="grid grid-cols-2 gap-4"
        >


          <input
            type="text"
            placeholder="Guest Name"
            value={guestName}
            onChange={(e)=>setGuestName(e.target.value)}
            className="border p-3 rounded-lg"
            required
          />


          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="border p-3 rounded-lg"
            required
          />


          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
            className="border p-3 rounded-lg"
            required
          />


          <input
            type="text"
            placeholder="Assigned Event"
            value={eventName}
            onChange={(e)=>setEventName(e.target.value)}
            className="border p-3 rounded-lg"
            required
          />


          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Add Guest
          </button>


        </form>

      </div>




      <div className="bg-white p-6 rounded-xl shadow">


        <div className="flex justify-between items-center mb-4">
        <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
         Guest List
         </h2>

  <button
    onClick={exportGuestsToExcel}
    className="bg-green-600 text-white px-4 py-2 rounded-lg"
  >
    Export Excel
  </button>
</div>


          <span className="bg-slate-100 px-4 py-2 rounded-lg">
            Total Guests: {guests.length}
          </span>


        </div>



        <input

          type="text"

          placeholder="Search guests..."

          value={searchTerm}

          onChange={(e)=>setSearchTerm(e.target.value)}

          className="w-full border p-3 rounded-lg mb-6"

        />




        <div className="overflow-x-auto">


          <table className="w-full">


            <thead>

              <tr className="border-b bg-slate-50 dark:bg-slate-700">


                <th className="text-left p-3">
                  Name
                </th>


                <th className="text-left p-3">
                  Email
                </th>


                <th className="text-left p-3">
                  Phone
                </th>


                <th className="text-left p-3">
                  Event
                </th>


                <th className="text-left p-3">
                  Actions
                </th>


              </tr>


            </thead>



            <tbody>


              {
                filteredGuests.map((guest)=>(


                  <tr
                    key={guest._id}
                    className="border-b"
                  >


                    <td className="p-3">
                      {guest.name}
                    </td>


                    <td className="p-3">
                      {guest.email}
                    </td>


                    <td className="p-3">
                      {guest.phone}
                    </td>


                    <td className="p-3">
                      {guest.eventName}
                    </td>


                    <td className="p-3">


                      <button

                        onClick={()=>deleteGuest(guest._id)}

                        className="bg-red-600 text-white px-4 py-2 rounded-lg"

                      >

                        Delete

                      </button>


                    </td>


                  </tr>


                ))
              }



              {
                filteredGuests.length === 0 && (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center p-8 text-gray-500 dark:text-gray-300"
                    >

                      No guests found

                    </td>


                  </tr>

                )
              }



            </tbody>


          </table>


        </div>


      </div>


    </div>

  );

}


export default Guests;