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


                    {/*<a href="#About">About Us </a>*/}

                    <div className="nav-dropdown">
                      <button className="nav-menu-btn">About Us</button>

                      <div className="dropdown-menu">
                           <div className="dropdown-column">
                             <h3>About BhuDrishti</h3>
                             <a href="#who-we-are">Who We Are<p>DRISHTI is a unified digital platform for land and property mapping that  combines 2D maps,3D buildings Visualization and property information in one place</p></a>
                             <a href="#vision">Our Vision<p>To make land and property information more accessible,understandable and easier to verify through digital mapping technplogy</p></a>
                             <a href="#mission">Our Mission<p>We integrate existing land records, mapping data and 3D visualization to provide a simpler and more interactive property-mapping experience</p></a>
                           </div>

                           {/*<div className="dropdown-column">
                              <h3>Our Purpose</h3>
                              <a href="#property-mapping">Property Mapping</a>
                              <a href="#ulpin">ULPIN Generation</a>
                              <a href="#digital-land">Digital Land Records</a>
                           </div>*/}

                           
                        </div>
                    </div>

                    
                    
                    {/*<a href="#services">Our Services</a>*/}

                    <div className="nav-dropdown">
                        <button className="nav-menu-btn">Our Services</button>
                        <div className="dropdown-menu">
                            <div className="dropdown-column">
                                <h3>Mapping Services</h3>
                                <a href="#2d-mapping">2D Property Mapping</a>
                                <a href="#3d-mapping">3D Property Mapping</a>
                                <a href="#land-mapping">Land Mapping</a>
                           </div>

                            <div className="dropdown-column">
                                <h3>Property Services</h3>
                                <a href="#ulpin">ULPIN Search</a>
                                <a href="#property-info">Property Information</a>
                                <a href="#building-view">3D Building Visualization</a>
                            </div>

                            <div className="dropdown-column">
                              <h3>GIS & Survey</h3>
                              <a href="#gis">GIS Integration</a>
                              <a href="#survey">Surveyor Support</a>
                              <a href="#geospatial">Geospatial Data</a>
                           </div>

                        </div>
                    </div>

                    


                    {/*<a href="#work">Our Work</a>*/}


                    <div className="nav-dropdown">
                        <button className="nav-menu-btn">Our Work</button>
                        <div className="dropdown-menu">
                            <div className="dropdown-column">
                                <h3>Our Work</h3>
                                <a href="#3d-mapping">3D Property Mapping</a>
                                <a href="#ulpin-mapping">ULPIN Mapping</a>
                                <a href="#land-mapping">Land Mapping</a>
                            </div>
                            <div className="dropdown-column">
                                <h3>Projects</h3>
                                <a href="#property">Property Visualization</a>
                                <a href="#urban">Urban Mapping</a>
                                <a href="#gis">GIS Solutions</a>
                            </div>
                            <div className="dropdown-column">
                                <h3>Technology</h3>
                                <a href="#3d">3D Mapping</a>
                                <a href="#gis-tech">GIS Technology</a>
                                <a href="#data">Geospatial Data</a>
                           </div>
                       </div>
                   </div>



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