import React, {Component} from 'react';

export default class CalendarIcon extends Component {
  render() {
    const { date } = this.props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="58" height="60" viewBox="0 0 58 60"> 
            <defs> 
                <filter id="Rectangle_5" x="3" y="3" width="55" height="57" filterUnits="userSpaceOnUse"> <feOffset dx="2" dy="2" input="SourceAlpha"/> 
                    <feGaussianBlur stdDeviation="1" result="blur"/> 
                    <feFlood floodOpacity="0.341"/> 
                    <feComposite operator="in" in2="blur"/> 
                    <feComposite in="SourceGraphic"/> 
                </filter>                
            </defs> 
            <g id="Group_2" data-name="Group 2" transform="translate(1423 -982)"> 
                <g id="Group_1" data-name="Group 1"> 
                    <rect id="Rectangle_4" data-name="Rectangle 4" width="57" height="59" rx="2" transform="translate(-1423 982)" fill="#93959c"/> 
                    <g transform="matrix(1, 0, 0, 1, -1423, 982)" filter="url(#Rectangle_5)"> 
                        <rect id="Rectangle_5-2" data-name="Rectangle 5" width="49" height="51" rx="2" transform="translate(4 4)" fill="#fff"/> 
                    </g> 
                    <path id="Rectangle_6" data-name="Rectangle 6" d="M2,0H47a2.306,2.306,0,0,1,2,2.52v18.9H0V2.52A2.306,2.306,0,0,1,2,0Z" transform="translate(-1370 1037) rotate(180)" fill="#781119"/> 
                </g> 
                <text id="SEP" transform="translate(-1407 1032)" fill="#fff" fontSize="14" fontFamily='Montserrat, sans-serif' fontWeight="500"><tspan x="0" y="0">{date[1]}</tspan></text> 
                <text id="_14" data-name="14" transform="translate(-1407 1009)" fill="#2d2d2d" fontSize="22" fontFamily='Montserrat, sans-serif'><tspan x="0" y="0">{date[0]}</tspan></text> 
                </g> 
        </svg>
    );
  }
}