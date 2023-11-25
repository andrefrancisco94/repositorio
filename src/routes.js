import React from 'react';
import { BrowserRouter, Route, Routes as Rotas } from 'react-router-dom';

import Main from './pages/Main';
import Repositorio from './pages/Repositorio';

export default function Routes() {
    return(
        <BrowserRouter>
            <Rotas>
                <Route exact path="/" element={<Main />} />
                <Route exact path="/repositorio/:id" element={<Repositorio/>} />
            </Rotas>
        </BrowserRouter>
    )
}