import React, {Component} from 'react';

export default class StartIcon extends Component {
  render() {
    const { color } = this.props;
    let style = `.a{stroke:#fff;stroke-width:3px;}.b{stroke:none;}.c{fill:none;}.d{filter:url(#a);}`
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 42 42">
            <defs>
                <style>{style}</style>
                <filter fill={color} id="a" x="0" y="0" width="42" height="42" filterUnits="userSpaceOnUse">
                    <feOffset dy="2" input="SourceAlpha"/>
                    <feGaussianBlur stdDeviation="3" result="b"/><feFlood floodColor="#3da3f2" floodOpacity="0.631"/>
                    <feComposite operator="in" in2="b"/><feComposite in="SourceGraphic"/>
                </filter>
            </defs>
            <g transform="translate(9 7)">
                <g className="d" transform="matrix(1, 0, 0, 1, -9, -7)" fill={color}>
                    <g className="a" transform="translate(9 7)">
                        <circle className="b" cx="12" cy="12" r="12"/>
                        <circle className="c" cx="12" cy="12" r="10.5"/>
                        </g>
                    </g>
                </g>
        </svg>
    );
  }
}