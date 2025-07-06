import React from 'react'
import { GiBookshelf } from "react-icons/gi";
import { GiCampCookingPot } from "react-icons/gi";
import { LuKeyboardMusic } from "react-icons/lu";
import { AiTwotoneCode } from "react-icons/ai";

const LandingPage = () => {
  return (
    <div>
        <div>SkillSwap&#39;s Goal</div>
        <div>
            <p>
                Empowering Tommorow&#39;s <br />
                Achievers Through Skill <br />
                Development 
            </p>
            <GiBookshelf />
            <GiCampCookingPot />
            <LuKeyboardMusic />
            <AiTwotoneCode />
        </div>
        <div>
            <div>
                <button>Explore Skills</button>
                <button>
                    <div></div>
                    Watch 
                </button>
            </div>
            <div>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                   Incidunt libero iste, inventore, sed soluta a vitae amet 
                   nulla similique nisi veniam modi, ex explicabo.</p>
            </div>
        </div>
        <div>
            <div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </div>
  )
}

export default LandingPage