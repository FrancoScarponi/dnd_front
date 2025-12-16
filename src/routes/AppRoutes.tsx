import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import PrivateRoute from "./PrivateRoute";
import CampaignsPage from "../pages/CampaignsPage";
import CampaignDetailPage from "../pages/CampaignDetailPage";
import CampaignNewPage from "../pages/CampaignNewPage";
import AppLayout from "../components/AppLayout";
import CharactersPage from "../pages/CharacterPage";
import CharacterNewPage from "../pages/CharacterNewPage";
import CharacterEditPage from "../pages/CharacterEditPage";
import CampaignCharactersPage from "../pages/CampaignCharactersPage";
import CampaignSessionsPage from "../pages/CampaignSessionPage";
import NewSessionPage from "../pages/NewSessionPage";
import CampaignJoinPage from "../pages/CampaignJoinPage";
import SessionDetailPage from "../pages/SessionDetailPage";

const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas publicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Privadas y Layout */}
      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        {/* Campañas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/campaigns/new" element={<CampaignNewPage />} />
        <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
        <Route path="/campaigns/:campaignId/characters" element={<CampaignCharactersPage />} />\
        <Route path="/campaigns/join" element={<CampaignJoinPage />} />


        {/* Sesiones */}
        <Route path="/campaigns/:id/sessions" element={<CampaignSessionsPage />} />
        <Route path="/sessions/new" element={<NewSessionPage />} />
        <Route path="/campaigns/:id/sessions/:sessionId" element={<SessionDetailPage />} />

        
        {/* Personajes */}
        <Route path="/characters" element={<CharactersPage />} />
        <Route path="/characters/new" element={<CharacterNewPage />} />
        <Route path="/characters/:id/edit" element={<CharacterEditPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
