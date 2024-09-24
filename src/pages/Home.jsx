import React from 'react'
import { Link } from 'react-router-dom'

import vaultImage from '../assets/images/home/secure-vault-tilted.png'
import securitySymbolDark from '../assets/images/home/icons8-grand-master-key-100_dark.png'
import crossPlatformSymbolDark from '../assets/images/home/icons8-internet-of-things-64_dark.png'
import peaceOfMindSymbolDark from '../assets/images/home/icons8-spa-flower-100_dark.png'

export default function Home(){
    return (
        <main className="main main__home">
            <section className="hero">
                <h1 className="hero__textcontainer">
                    <span className="hero__text hero__text_top">Secure.</span>
                    <span className="hero__text hero__text_middle">Contain.</span>
                    <span className="hero__text hero__text_bottom">Protect.</span>
                </h1>
            </section>

            <section className="reputation">
                <h2 className="reputation__heading">The Most Secure Password Manager in the World</h2>
                <img
                    src={vaultImage}
                    className="reputation__img"
                />
                <p className="reputation__text">Rest easy with our world-class Keter certified security and protection.</p>
            </section>

            <section className="offerings">
                <h3 className="offerings__heading">What We Offer</h3>
                <ul className="offerings__list">
                    <li className="offerings__item">
                        <img 
                            src={securitySymbolDark}
                            className="offerings__item_img" 
                        />
                        <p>
                            Cutting edge security
                        </p>
                    </li>

                    <li className="offerings__item">
                        <img 
                            src={crossPlatformSymbolDark}
                            className="offerings__item_img" 
                        />
                        <p>
                            Cross platform accessibility
                        </p>
                    </li>

                    <li className="offerings__item">
                        <img 
                            src={peaceOfMindSymbolDark}
                            className="offerings__item_img" 
                        />
                        <p>
                            Peace of mind
                        </p>
                    </li>
                </ul>
            </section>

            {/* <section>
                reviews
                side scroller that you can grab
            </section> */}

            <section className="signup">
                <h4 className="signup__heading">
                    Secure your privacy today.
                </h4>
                <Link 
                to='/signup'
                className="signup__link"
                >
                    Sign up
                </Link>
            </section>
        </main>
    )
}