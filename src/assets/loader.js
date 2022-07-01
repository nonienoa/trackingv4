import React from 'react'
import Lottie from 'react-lottie';
import animationData from './data.json'
 
export default class LottieControl extends React.Component {
 
  constructor(props) {
    super(props);
    this.state = {isStopped: false, isPaused: false};
  }
 
  render() { 
    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };
 
    return <div>
      <Lottie 
        height={40}
        width={40}
        options={defaultOptions} />
    </div>
  }
}