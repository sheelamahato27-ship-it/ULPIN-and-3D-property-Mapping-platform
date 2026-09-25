import "./dashboard.css";
import BuildingViewport from "./buildingViewPort";
import {useState} from "react";
function Dashboard() {
    
    return(
        <div className="dashboard">

            <nav className="navbar">
                <div className="logo">
                    {/*<span className = "logo-box">ULPIN</span>*/}
                    <span className = "logo-text">Property Mapping</span>
                </div>
                <div className="nav-links">
                    <a href="#About">About Us </a>
                    <a href="#services">Our Services</a>
                    <a href="#work">Our Work</a>
                </div>
            </nav>
            <main>
                <div>CONTENT</div> 
                <div className="map=image">Property Map</div>
                <section className="search-section">
                    <h2>Search ULPIN /  Maps</h2>
                    <div className="search-box">
                        <input type="text" placeholder="Enter ULPIN or Search location"/>
                        {/*<button>Search</button>*/}
                    </div>
                </section>
        
            </main>
            <footer className="footer">
                <div>
                    <h3>CONTACT US </h3>
                    <p>Phone: XXXXXXXXXXX</p>
                    <p>Email: abc@gmail.com</p>
                </div>
                <p className="copyright">
                        ULPIN 3D Property Mapping Platform. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
export default Dashboard;