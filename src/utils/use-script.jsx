/**
 * Dynamic script loading hook.
 */
 import React from 'react';

 // If no callback is provided, the script will not be removed on unmount. This
 // kinda matters if the script loading is not idempotent (for some reason
 // MathJax is not, which is one of the scripts I was using this for) or
 // if you need the callback to happen again.
 const useScript = (
   scriptUrl,
   scriptId,
   callback
 ) => {
   React.useEffect(() => {
     const existingScript = document.getElementById(scriptId);
 
     if (!existingScript) {
       const script = document.createElement('script');
       script.src = scriptUrl;
       script.id = scriptId;
       document.body.appendChild(script);
 
       script.onload = () => {
         if (callback) {
           callback();
         }
       };
     }
 
     if (existingScript && callback) {
       callback();
     }
 
     return () => {
       if (existingScript && callback) {
         existingScript.remove();
       }
     };
   }, [scriptUrl, scriptId]);
 };
 
 export default useScript;
 