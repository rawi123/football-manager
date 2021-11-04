import React from 'react'
import "./home.css"
import { Link } from 'react-router-dom'
export default function Home({ user }) {
    return (
        <div id="global-container">
            
            <div id="home">
                <h4>Welcome to Football Manager 2021⚽</h4>
                <div>
                    <div className="home-container">
                        <div className="content">
                            <h1>Football Manager - GameBy Rawi Lahiany</h1>
                            <p>
                                <span>Football Manager </span>is a living, breathing game world of unparalleled realism and achieves football authenticity that other football games can only aspire to.
                                Play againts players around the globe, win points, upgrade your team and buy new player to be the best! 
                                always remember to work hard and have fun!⚽
                            </p>
                        </div>
                        <div className="links">
                            <div className="social-media rawi">
                                <div>
                                    <a href="https://github.com/rawi123" target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>
                                    <a href="https://www.linkedin.com/in/rawi-lahiani-1a955a1b2/" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a>
                                    <a href="https://www.instagram.com/rawi_lahiany/" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="home-container nav-home">
                    <ul>
                        {Object.keys(user).length > 0 ? <>
                            <Link to="/shop"><li>Shop</li></Link>
                            <Link to="/game"><li>play Game</li></Link>
                            <Link to="/leagueTable"><li>League Table</li></Link>
                            <Link to="/preview"><li>My Team</li></Link></> :
                            <Link to="/login"><li>Log In</li></Link>}
                    </ul>
                </div>
            </div>
        </div>
    )
}