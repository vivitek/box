import React from "react";
import { BrowserRouter } from "react-router-dom";
import Page from "./components/Pages";
import Routes from "./Router";



const App = () => {
  return (
      <BrowserRouter>
        <main>
          <Page>
            <Routes />
          </Page>
        </main>
      </BrowserRouter>
  );
}

export default App;
