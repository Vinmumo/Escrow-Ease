import Socials from "./Socials"

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <p className='note'>
          Please note that these vehicles are from our partnered dealerships. 
          Escrow Ease facilitates secure transactions between buyers and sellers.
        </p>
        <Socials />
        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
          &copy; {new Date().getFullYear()} Escrow Ease. All rights reserved.
        </p>
      </footer>
    </>
  )
}