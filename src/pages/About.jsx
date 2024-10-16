import React from 'react'
import { useOutletContext } from 'react-router-dom'
import missionImgDarkMode from '../assets/images/about/icons8-target-96_dark.png'
import storyImgDarkMode from '../assets/images/about/icons8-volunteering-64_dark.png'
import missionImgLightMode from '../assets/images/about/icons8-target-96_light.png'
import storyImgLightMode from '../assets/images/about/icons8-volunteering-64_light.png'

import githubDark from '../assets/images/about/team/github-mark_dark.png'
import linkedinDark from '../assets/images/about/team/icons8-linkedin-32_dark.png'
import githubLight from '../assets/images/about/team/github-mark_light.png'
import linkedinLight from '../assets/images/about/team/icons8-linkedin-30_light.png'

import rqHeadshot from '../assets/images/about/team/Headshot_RQuiambao.jpg'

export default function About(){

    const theme = useOutletContext()

    React.useEffect(()=>{
        if(theme === 'light'){
            document.querySelectorAll('*').forEach(e => e.classList.add('light'))
        }else{
            document.querySelectorAll('*').forEach(e => e.classList.remove('light'))
        }
    },[theme])

    return (
        <main className='main main__about'>
            <section className='mission'>
                <h1 className='mission__heading'>
                    Our Mission
                </h1>
                <img className='mission__img' src={theme === 'light' ? missionImgLightMode : missionImgDarkMode} alt='A target reticle'/>
                <p className='mission__text'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis molestias, perferendis porro sed ab in illo perspiciatis eveniet excepturi, at similique autem qui, facere odit ducimus! Harum consequatur non architecto, praesentium atque consectetur illo doloremque explicabo ut minus minima impedit?</p>
            </section>

            <section className='story'>
                <h2 className='story__heading'>
                    Our Story
                </h2>
                <img className='story__img' src={theme === 'light' ? storyImgLightMode : storyImgDarkMode} alt='A target reticle'/>
                <p className='story__text'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod velit, quo nobis eum voluptatum numquam blanditiis voluptate quae magnam magni perferendis odio dolore quibusdam aperiam nulla amet debitis quos adipisci ducimus quidem exercitationem ab fugiat.</p>
            </section>

            <section className='team'>
                <h3 className='team__heading'>
                    Our Team
                </h3>
                {/* Use Firebase for Team data*/}
                <div className='team__member'>
                    <img
                        className='team__img'
                        src={rqHeadshot}
                        alt='Ramon Quiambao, Web Developer'
                    />
                    <div className='team__details'>
                        <p className='team__name'>Ramon Quiambao</p>
                        <p className='team__role'>Web Developer</p>
                        <a 
                            href='https://github.com/rldmq'
                            className='team__links'
                            target='_blank'
                        >
                            <img
                                src={theme === 'light' ? githubLight : githubDark}
                                alt='Github Link'
                                className='team__links_img'
                            />
                        </a>

                        <a
                            href='https://www.linkedin.com/in/rquiambao/'
                            className='team__lins'
                            target='_blank'
                        >
                            <img
                                src={theme === 'light' ? linkedinLight : linkedinDark}
                                alt='LinkedIn Link'
                                className='team__links_img'
                            />
                        </a>
                    </div>
                </div>
            </section>

        </main>
    )
}