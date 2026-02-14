import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import GlobalStyle from '@/styles/GlobalStyle';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/Home/HomePage';
import LoginPage from '@/pages/Auth/Login/LoginPage';
import SignupPage from '@/pages/Auth/Signup/SignupPage';

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
          </Routes>
        </Layout>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
