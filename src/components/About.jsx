import Header from "./Header"
import { NavLink } from "react-router-dom"

export default function About() {
  return (
    <>
      <Header />
      <div className="aboutcontainer">
        <h1 className="aboutus">About Us</h1>
        <div className="aboutCard">
          <p className="paragraph">
            Welcome to Escrow Ease, your trusted partner in secure automotive transactions. 
            With a commitment to safeguarding your investments, we provide a secure, transparent platform for seamless vehicle exchanges. 
            Our experienced team ensures reliability and professionalism every step of the way, offering complete peace of mind in your financial dealings.
            Whether you're buying, selling, or trading vehicles, trust us to facilitate your transactions with integrity and utmost care.
          </p>
        </div>
        <NavLink className="goback" to="/">Go Back</NavLink>
      </div>
    </>
  )
}