import React from 'react'
import { LoadingStateWrapper } from '../utils/styles';

const LoadingState = () => {
    return (
        <LoadingStateWrapper>
          <div className="first"></div>
          <div className="second"></div>
          <div className="last"></div>
        </LoadingStateWrapper>
      );
}

export default LoadingState