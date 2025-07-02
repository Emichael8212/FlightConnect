import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";


export default function Recommendation() {

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/profile`,
                    {withCredentials: true});
                isSetUser(response.data)
            }   catch (error) {
                console.error("User not Authenticated")
            }
        };
        getUser();
    }, [])

    return (
        <section>
            <h2>Search or Filter Destination</h2>
            <div className="search">
                <input type="text" placeholder="Search..." />
                <button>Search</button>
            </div>
            <div className="filter">
                <label>Region:</label>
                <select>
                    <option value="asia">Asia</option>
                    <option value="europe">Europe</option>
                    <option value="north-america">North America</option>
                    <option value="south-america">South America</option>
                    <option value="africa">Africa</option>
                    <option value="oceania">Oceania</option>
                </select>
                <label>Budget:</label>
                <select>
                    <option value="cheap">Cheap</option>
                    <option value="moderate">Moderate</option>
                    <option value="expensive">Expensive</option>
                </select>
                <label>Activity:</label>
                <select>
                    <option value="beach">Beach</option>
                    <option value="hiking">Hiking</option>
                    <option value="shopping">Shopping</option>
                    <option value="sightseeing">Sightseeing</option>
                    <option value="party">Party</option>
                    <option value="relaxation">Relaxation</option>
                </select>
                <label>Popularity:</label>
                <select>
                    <option value="popular">Popular</option>
                    <option value="not-popular">Not Popular</option>
                </select>
            </div>

            <h2>Top Recommendation</h2>
            <div className="recommendation">
                <h3>Destination Name</h3>
                <p>Destination Description</p>
                <p>Destination Price</p>
                <p>Destination Rating</p>
                <p>Destination Activity</p>
                <p>Destination Region</p>
                <p>Destination Popularity</p>
            </div>



        </section>
    )
}
