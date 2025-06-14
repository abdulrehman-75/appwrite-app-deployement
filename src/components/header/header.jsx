import React, { useState } from 'react';
import { Container, Logo, LogoutBtn } from '../index';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu } from 'lucide-react';

function Header() {
    const authStatus = useSelector((state) => state.auth.status);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const navItems = [
        { name: 'Home', slug: '/', active: true },
        { name: 'All Posts', slug: '/all-posts', active: authStatus },
        { name: 'Add Post', slug: '/add-post', active: authStatus },
    ];

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    return (
        <header className="z-50 py-4 bg-black border-b border-orange-500 shadow-md">
            <Container>
                <nav className="relative flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/">
                            <Logo width="70px" />
                        </Link>
                    </div>

                    {/* Desktop Nav Links */}
                    <ul className="items-center hidden gap-4 ml-auto sm:flex">
                        {navItems.map(
                            (item) =>
                                item.active && (
                                    <li key={item.name}>
                                        <button
                                            onClick={() => navigate(item.slug)}
                                            className="px-4 py-2 text-white transition-colors rounded-full hover:bg-orange-500"
                                        >
                                            {item.name}
                                        </button>
                                    </li>
                                )
                        )}
                        {authStatus && (
                            <li>
                                <LogoutBtn />
                            </li>
                        )}
                    </ul>

                    {/* Mobile Menu Icon */}
                    <div className="flex items-center ml-auto sm:hidden">
                        <button
                            onClick={toggleMenu}
                            className="p-2 text-white rounded-md hover:bg-orange-500"
                            aria-label="Toggle menu"
                            aria-expanded={menuOpen}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Mobile Dropdown Menu */}
                    {menuOpen && (
                        <ul className="absolute z-50 mt-2 transition-all duration-200 bg-black border border-orange-500 rounded-md shadow-lg right-4 top-full w-44 sm:hidden">
                            {navItems.map(
                                (item) =>
                                    item.active && (
                                        <li key={item.name}>
                                            <button
                                                onClick={() => {
                                                    navigate(item.slug);
                                                    setMenuOpen(false);
                                                }}
                                                className="block w-full px-4 py-2 text-left text-white hover:bg-orange-500"
                                            >
                                                {item.name}
                                            </button>
                                        </li>
                                    )
                            )}
                            {authStatus && (
                                <li className="border-t border-orange-500">
                                    <div className="px-4 py-2">
                                        <LogoutBtn />
                                    </div>
                                </li>
                            )}
                        </ul>
                    )}
                </nav>
            </Container>
        </header>
    );
}

export default Header;
