import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className='header'>
      <nav className='main-nav'>
        <Link to='/'><span>{'<'}</span>All Boards</Link>
      </nav>
    </header>
  )
}

export default Navbar;
