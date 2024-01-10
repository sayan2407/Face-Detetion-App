import "./Footer.css"

const Footer = () => {
    const currentYear = new Date().getFullYear();
  return (
    <footer className='app-footer'>
        <p>&copy; {currentYear} Sayan Pal</p>
    </footer>
  )
}

export default Footer