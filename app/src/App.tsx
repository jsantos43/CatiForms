import { Navigate, Route, Routes } from 'react-router-dom';
import { GuestOnly, RequireAuth } from './auth/guards';
import { AppLayout } from './layouts/AppLayout';
import Cadastro from './pages/Cadastro/Cadastro';
import CriarFormulario from './pages/CriarFormulario/CriarFormulario';
import Enviado from './pages/Enviado/Enviado';
import Formularios from './pages/Formularios/Formularios';
import Login from './pages/Login/Login';
import NotFound from './pages/NotFound/NotFound';
import Publicado from './pages/Publicado/Publicado';
import Responder from './pages/Responder/Responder';
import Respostas from './pages/Respostas/Respostas';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/formularios" replace />} />

      <Route element={<GuestOnly />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/formularios" element={<Formularios />} />
          <Route path="/formularios/novo" element={<CriarFormulario />} />
          <Route path="/formularios/:id" element={<Respostas />} />
          <Route path="/formularios/:id/publicado" element={<Publicado />} />
        </Route>
      </Route>

      {/* Públicas: qualquer pessoa com o link responde, sem cadastro (RF09). */}
      <Route path="/f/:codigo" element={<Responder />} />
      <Route path="/f/:codigo/enviado" element={<Enviado />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
