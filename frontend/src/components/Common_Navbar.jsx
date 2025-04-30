import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaAngleDown, FaShoppingCart} from 'react-icons/fa';
import {useLocation} from 'react-router-dom';
import logo from "../assets/images/logo.png";
import {useState, useEffect} from 'react';
import '../assets/css/Common_Navbar.css';


const Common_Navbar = () => {
    const {address, setAddress} = useAddress();
    const [addressInput, setAddressInput] = useState(address);
    const handleChange = (event) => {
        console.log("Calling setAddressInput in handleChange in Common_Navbar")
        console.log("address value = ",address)
        setAddressInput(event.target.value);
    }
    const handleKeyDown = (event) => {
        if (event.key === "Enter"){
            event.preventDefault();
            console.log("Calling updateAddress in handleKeyDown in Common_Navbar")
            setAddress(addressInput);
            console.log("Address = ",address)
        }
    }
    const [cartSideScreenOpen,setCartSideScreenOpen] = useState(false);
    const toggleCartSideScreen = () => {
        setCartSideScreenOpen(!cartSideScreenOpen);
    }
    const {isLoggedIn,login,logout} = useAuth();
    const location = useLocation(); // Get current location
    const [menuSideScreenOpen, setMenuSideScreenOpen]  = useState(false);
    const toggleMenuSideScreen = () => {
        setMenuSideScreenOpen(!menuSideScreenOpen);
    };
    const [addressDropDown, setAddressDropDown] = useState(false);
    const toggleAddressDropDown = () => {
        setAddressDropDown(!addressDropDown);
    }
    return (
        <div className="navigation-container">
            <nav className="navbar">
                {/*Common Nav bar components across all pages*/}
                <span className="logo-brand">
                    <span className="menu-icon">
                        <FaBars size={24} className="menu" onClick={toggleMenuSideScreen} /> {/*Using the imported menu icon*/}
                        {menuSideScreenOpen && (
                            <div className={`menuSideScreenContent ${menuSideScreenOpen ? 'show' : ''}`}>
                                <FaTimes className="close-menu-sideScreen-icon" onClick={toggleMenuSideScreen} />
                                <span className="login-signup-or-logout-sidescreen">
                                    {!isLoggedIn ? (
                                        <span className="login-signup-buttons-sidescreen">
                                        <button className="login-button-sidescreen" onClick={login}>
                                            <a href="/login" className="login" style={{ color: "white" }}>Login</a>
                                            {/*<Link to="/login" className="login" style={{ color: "white" }}>Login</Link>*/}
                                        </button><br></br>
                                        <button className="signup-button-sidescreen">
                                            <a href="/signup" className="signup" style={{ color: "#E87500" }}>Login</a>
                                            {/*<Link to="/signup" className="signup" style={{ color: "#E87500" }}>Sign Up</Link>*/}
                                        </button>
                                    </span>
                                    ) : (
                                        <button className="logout-button" onClick={logout}>
                                            <a href="/login" className="logout" style={{color: "white"}}>Logout</a>
                                        </button>
                                    )}                                      
                                </span>
                                <a href="/signup" className="register-restaurant">Add your Restaurant</a> {/*Change "/register" to vendor signup API once you receive it from Group 2*/}
                            </div>
                        )}
                    </span>
                    <span className="logo">
                        <Link to="/home" className="logo-home">
                            <img src={logo} className="logo-image"></img>
                            <span className="logo-text">Feast-IT</span>
                        </Link>
                    </span>
                </span>
                <div className="search-bar-container">
                    <div className="search-wrapper">
                        <FaMapMarkerAlt size={24} className="search-location" style={{ color: "#E87500", paddingRight: "10px", paddingLeft: "5px" }} />
                        <input type="text" placeholder="Enter your delivery address" className="search-bar" value={addressInput} onChange={handleChange} onKeyDown={handleKeyDown}></input>
                        <FaAngleDown size={24} className="dropdown-icon" style={{ color: "#E87500", paddingRight: "10px", paddingLeft: "5px", cursor: 'pointer', marginLeft: 'auto' }} onClick={toggleAddressDropDown} />
                        {addressDropDown && (
                            <div className={`addressDropDownContent ${addressDropDown ? 'show' : ''}`}>
                                <Link to='/addresses' className="manage-addresses" style={{ color: "#E87500", backgroundColor: "white" }}>Manage Addresses</Link>
                            </div>
                        )}
                    </div>
                </div>
                <div className="login-signup-cart">
                    <div className="login-and-signup">
                        {!isLoggedIn && (
                            <div className="login-signup-buttons">
                                <button className="login-button" onClick={login}>
                                    <Link to="/login" className="login" style={{ color: "white" }}>Login</Link>
                                </button>
                                <button className="signup-button">
                                    <Link to="/signup" className="signup" style={{ color: "#E87500" }}>Sign Up</Link>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="cart">
                        <FaShoppingCart size={24} color="white" className="shopping-cart-icon" onClick={toggleCartSideScreen} />
                        {/*<span className="cart-badge">{getTotalItems()}</span>*/}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Common_Navbar;
