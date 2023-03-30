import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import reportWebVitals from "./reportWebVitals";
import ThemeContext from "./context/ThemeContext";

// const root=ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//     <React.StrictMode>
//         <Provider store={store}>
//             <BrowserRouter>
//                 <ThemeContext>
//                     <App />
//                 </ThemeContext>
//             </BrowserRouter>
//         </Provider>
//     </React.StrictMode>,
// );

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <ThemeContext>
                    <App />
                </ThemeContext>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);
reportWebVitals();
