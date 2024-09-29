import React from 'react';
import Lottie from "lottie-react";
import SuccAnim from "./success.json";

export const Success = (lottieRef:React.RefObject<any>, complete: () => void) => {
  return <Lottie lottieRef={lottieRef} 
                 animationData={SuccAnim}
                 onComplete={complete}
                 //@ts-ignore
                 loop={false}
                 autoplay={false} 
        />;
};
