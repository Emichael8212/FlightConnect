import { useState, useEffect } from "react";
import axios from "axios";


export default function Home() {
    const [setUser, isSetUser] = useState("");
    const [searchType, setSearchType] = useState("route")
    const [flightFoem, setFlightForm] = useState({
        airline: "",
        date: "",
        origin: "",
        destination: ""
    })

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/profile`,
                    {
                        withCredentials: true
                    }
                );
                getUser = response.data
            }   catch (error) {
                console.error("User not Authenticated")
            }       
        };

        getUser();
    }, [])

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFlightForm(prev => ({...prev, [name]: value}));
    };

    // handle subnission
    const handleSearch = (event) => {
        event.preventDefault();

        if (searchType === "flight") {
            
        }
    }




    return (
        <main>
            <div className="flight-container">
                <h2>WELCOME {username}</h2>
                <p>Connect with your loved ones as they travel.</p>
                <section className="track-searchbar">
                    <div className="search-btns">
                        <button className="flight-btn">By Flight number</button>
                        <button className="route-btn">By Route</button>
                    </div>
                    <form action=""></form>
                    
                </section>
            </div>
        </main>
    )
}