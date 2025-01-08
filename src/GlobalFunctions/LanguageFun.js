import { useState, useContext, createContext } from "react";
import EnglishLang from "../Languages/English.json";
import KannadaLang from "../Languages/Kannada.json";
import HindiLang from "../Languages/Hindi.json";
import GujarathiLang from "../Languages/Gujarati.json";
import TamilLang from "../Languages/Tamil.json";
import TeluguLang from "../Languages/Telugu.json";
import MalayalamLang from "../Languages/Malayalam.json";
import MarathiLang from "../Languages/Marati.json";

const LangContext = createContext(null);
export const LangContextProvider = ({ children }) => {
  const [userLanguage, setUserLanguage] = useState(EnglishLang);
  const [userSelectedLanguage, setUSerSelectedLanguage] = useState("English");
  const [stateWiseLangDetails, setStateWiseLangDetails] = useState({
    terminalid: null,
    state: null,
  });

  const handleStatewiseLanguage = (terminalLangDetails) => {
    console.log(terminalLangDetails);
    setStateWiseLangDetails({ ...terminalLangDetails });
  };

  const changeUserLanguageFun = (lang) => {
    const userLanguage = lang;
    if (userLanguage === "English") {
      setUSerSelectedLanguage("English");
      setUserLanguage(EnglishLang);
    } else if (userLanguage === "Kannada") {
      setUserLanguage(KannadaLang);
      setUSerSelectedLanguage("Kannada");
    } else if (userLanguage === "Hindi") {
      setUserLanguage(HindiLang);
      setUSerSelectedLanguage("Hindi");
    } else if (userLanguage === "Gujarati") {
      setUserLanguage(GujarathiLang);
      setUSerSelectedLanguage("Gujarati");
    } else if (userLanguage === "Malayalam") {
      setUserLanguage(MalayalamLang);
      setUSerSelectedLanguage("Malayalam");
    } else if (userLanguage === "Marathi") {
      setUserLanguage(MarathiLang);
      setUSerSelectedLanguage("Marathi");
    } else if (userLanguage === "Tamil") {
      setUserLanguage(TamilLang);
      setUSerSelectedLanguage("Tamil");
    } else if (userLanguage === "Telugu") {
      setUserLanguage(TeluguLang);
      setUSerSelectedLanguage("Telugu");
    }
  };

  return (
    <LangContext.Provider
      value={{
        userLanguage,
        userSelectedLanguage,
        changeUserLanguageFun,
        handleStatewiseLanguage,
        stateWiseLangDetails,
      }}
    >
      {children}
    </LangContext.Provider>
  );
};

export const UseLanguage = () => {
  return useContext(LangContext);
};
