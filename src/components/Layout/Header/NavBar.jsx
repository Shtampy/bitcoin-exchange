import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { LogOut, Menu, X } from "lucide-react";

const Navbar = () => {
  const user = JSON.parse(sessionStorage.getItem("user")) || null;
  const getLinkStyle = (path) => {
    return location.pathname === path
      ? { backgroundColor: "#ffa500", color: "#fff" } 
      : { color: "#000"};
  };
const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="nav-main h-fit md:h-[60px]">
       <ul className="nav-ul nav-list hidden md:flex">
        <li className="nav-item">
          <Link className="nav-link" to="/" 
            style={getLinkStyle("/")}>
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/portfolio" style={getLinkStyle("/portfolio")}>
            Portfolio
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/favorites" style={getLinkStyle("/favorites")}>
            Favorites
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/orders" style={getLinkStyle("/orders")}>
            Buy Coins
          </Link>
        </li>
        {user?.email &&
        <li
        className="nav-item"
        onClick={() => {
          sessionStorage.removeItem("user");
          window.location.replace("/");
        }}
      >
        <button className="nav-link flex items-center gap-2 text-red-500">
          Logout <LogOut />
        </button>
      </li>}
      </ul>
      <ul className="nav-ul nav-list flex md:hidden flex-col md:flex-row gap-4 md:gap-0 relative py-4 md:py-0  ">
        {isOpen &&
        <X className=" absolute top-4 left-4 cursor-pointer" onClick={()=>{
          setIsOpen(false);
        }} />}
      {isOpen?
      <>
        <li className="nav-item">
          <Link className="nav-link" to="/" 
            style={getLinkStyle("/")}
            onClick={()=>{
              setIsOpen(false);
            }}>
            Home
          </Link>
        </li>
        <li className="nav-item"
        >
          <Link className="nav-link" to="/portfolio" style={getLinkStyle("/portfolio")}
          onClick={()=>{
            setIsOpen(false);
          }}>
            Portfolio
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/favorites" style={getLinkStyle("/favorites")}
          onClick={()=>{
            setIsOpen(false);
          }}>
            Favorites
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/orders" style={getLinkStyle("/orders")}
          onClick={()=>{
            setIsOpen(false);
          }}>
            Buy Coins
          </Link>
        </li>
        {user?.email &&
        <li
        className="nav-item"
        onClick={() => {
          sessionStorage.removeItem("user");
          window.location.replace("/");
        }}
      >
        <button className="nav-link flex items-center gap-2 text-red-500">
          Logout <LogOut />
        </button>
      </li>}</>:
      <Menu className="cursor-pointer nav-item" onClick={()=>{
        setIsOpen(true);
      }} />}
      </ul>
    </nav>
  );
};

export default Navbar;
