import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import GlobalStyle from '@/styles/GlobalStyle';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/Home/HomePage';
import LoginPage from '@/pages/Auth/Login/LoginPage';
import SignupPage from '@/pages/Auth/Signup/SignupPage';
import ProjectDetailPage from '@/pages/ProjectDetail/ProjectDetailPage';
import ProjectCreatePage from '@/pages/ProjectCreate/ProjectCreatePage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <GlobalStyle />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/project/create" element={<ProjectCreatePage />} />
            <Route path="/project/:projectId" element={<ProjectDetailPage />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
