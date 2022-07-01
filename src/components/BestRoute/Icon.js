import React, {Component} from 'react';

export default class SVGIconComponent extends Component {
  render() {
    const perc = this.props.perc || 0;
    const color = this.props.color || 'black';
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 42 42">
            <defs>
                <filter id="Ellipse_67" x="0" y="0" width="42" height="42" filterUnits="userSpaceOnUse">
                <feOffset dy="2" input="SourceAlpha"/>
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feFlood floodColor="#3da3f2" floodOpacity="0.631"/>
                <feComposite operator="in" in2="blur"/>
                <feComposite in="SourceGraphic"/>
                </filter>
            </defs>
            <g id="Group_591" data-name="Group 591" transform="translate(-9152 -7260)">
                <g id="blue_dot" data-name="blue dot" transform="translate(9161 7267)">
                <g transform="matrix(1, 0, 0, 1, -9, -7)" filter="url(#Ellipse_67)">
                    <g id="Ellipse_67-2" data-name="Ellipse 67" transform="translate(9 7)" fill={color} stroke="#fff" strokeWidth="3">
                    <circle cx="12" cy="12" r="12" stroke="none"/>
                    <circle cx="12" cy="12" r="10.5" fill="none"/>
                    </g>
                </g>
                </g>
            <text id="_2" data-name="2" transform="translate(9173 7283)" fill="#fff" ><tspan x={perc<10?"-3.702":"-6.902"} y="0">{perc}</tspan></text>
            </g>
        </svg>
    );
  }
}