import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useAuth, useTheme } from "../../contexts/AuthContext";
import { getUserProfile } from "../../services/user";

// Definição dos temas claro e escuro
const lightTheme = {
  body: "#FFF",
  text: "#363537",
  toggleBorder: "#FFF",
  background: "#363537",
};

const darkTheme = {
  body: "#363537",
  text: "#FAFAFA",
  toggleBorder: "#6B8096",
  background: "#999",
};

// Estilos para o container principal da página
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
  transition: all 0.5s linear;
`;

// Estilos para o card de perfil
const ProfileCard = styled.div`
  background-color: ${({ theme }) =>
    theme.body === "#FFF" ? "#f9f9f9" : "#424242"};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin-top: 1rem;
`;

// Estilos para os títulos
const Title = styled.h1`
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.5rem;
`;

// Estilos para os campos de informação
const InfoField = styled.div`
  margin-bottom: 1rem;
  label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
  }
  p {
    margin: 0;
    padding: 0.5rem;
    background-color: ${({ theme }) =>
      theme.body === "#FFF" ? "#eee" : "#555"};
    border-radius: 4px;
  }
`;

// Botão para alternar tema
const ThemeToggleButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.text};
  color: ${({ theme }) => theme.body};
  border: 2px solid ${({ theme }) => theme.toggleBorder};
  font-size: 0.8rem;
  &:hover {
    opacity: 0.8;
  }
`;

function ClientProfile() {
  const { darkMode, toggleTheme } = useTheme();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getUserProfile();
        setUserProfile(profileData);
      } catch (err) {
        setError("Falha ao carregar o perfil. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Dados de exemplo do perfil do cliente (substitua por dados reais)
  // const userProfile = {
  //   name: "Nome do Cliente",
  //   email: "cliente@exemplo.com",
  //   phone: "(00) 12345-6789",
  //   address: "Rua Exemplo, 123, Cidade, Estado",
  // };

  const currentTheme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <ProfileContainer>
        <ThemeToggleButton onClick={toggleTheme}>
          Alternar para Modo {darkMode ? "Claro" : "Escuro"}
        </ThemeToggleButton>
        <Title>Perfil do Cliente</Title>
        <ProfileCard>
          {loading && <p>Carregando perfil...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {userProfile && (
            <>
              <InfoField>
                <label>Nome:</label>
                <p>{userProfile.name}</p>
              </InfoField>
              <InfoField>
                <label>Email:</label>
                <p>{userProfile.email}</p>
              </InfoField>
              <InfoField>
                <label>Telefone:</label>
                <p>{userProfile.phone || "Não informado"}</p>
              </InfoField>
              <InfoField>
                <label>Endereço:</label>
                <p>{userProfile.address || "Não informado"}</p>
              </InfoField>
            </>
          )}
        </ProfileCard>
      </ProfileContainer>
    </ThemeProvider>
  );
}

export default ClientProfile;
