import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import VersionProvider from "./contexts/VersionProvider.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import MonViewer from "./components/MonViewer/MonViewer.tsx";
import LanguageProvider from "./contexts/LanguageProvider.tsx";
import {DexView} from "./components/DexList/DexView.tsx";
import _404 from "./components/_404.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {index: true, element: <DexView/>},
            {path: `/mon/:monName`, element: <MonViewer/>},
            {path: `/mon/`, element: <DexView/>},
            {path: `*`, element: <_404/>}
        ]
    }
]);

const rootElement = document.getElementById("root") as HTMLElement;

createRoot(rootElement).render(
    <StrictMode>
        <LanguageProvider>
            <VersionProvider>
                <RouterProvider router={router}/>
            </VersionProvider>
        </LanguageProvider>
    </StrictMode>,
)
