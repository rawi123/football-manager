import React from 'react'
import "./home.css"
export default function Home({ user }) {
    return (
        <div id="home">
            <div className="home-container">
                <div className="content">
                    <h1>Football Manager - Game By Rawi Lahiany</h1>
                    <p>
                        <span>Football Manager </span>is a living, breathing game world of unparalleled realism and achieves football authenticity that other football games can only aspire to.

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
    )
}