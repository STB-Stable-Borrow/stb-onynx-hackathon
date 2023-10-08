import { useState, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";

const AboutContext = createContext();

export const AboutProvider = ({ children }) => {
  const navigate = useNavigate();

  const [about, setAbout] = useState("Stable Borrow (STB)");

  const handleAboutToggle = (name) => {
    setAbout(name);
  };

  const navigateToAbout = (aboutContent) => {
    handleAboutToggle(aboutContent);
    navigate("/about");
  };

  return (
    <AboutContext.Provider
      value={{
        about,
        handleAboutToggle,
        navigateToAbout,
      }}
    >
      {children}
    </AboutContext.Provider>
  );
};

export const useAbout = () => useContext(AboutContext);
