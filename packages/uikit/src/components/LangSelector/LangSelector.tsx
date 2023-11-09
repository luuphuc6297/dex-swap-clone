import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import React from "react";
import { Colors } from "../../theme";
import Button from "../Button/Button";
import { Scale } from "../Button/types";
import Dropdown from "../Dropdown/Dropdown";
import { Position } from "../Dropdown/types";
// import LanguageIcon from "../Svg/Icons/Language";
import MenuButton from "./MenuButton";
import { Language } from "./types";

interface Props {
  currentLang: string;
  langs: Language[];
  setLang: (lang: Language) => void;
  color: keyof Colors;
  dropdownPosition?: Position;
  buttonScale?: Scale;
  hideLanguage?: boolean;
}

const LangSelector: React.FC<React.PropsWithChildren<Props>> = ({
  currentLang,
  langs,
  color,
  setLang,
  dropdownPosition = "bottom",
  buttonScale = "md",
  hideLanguage = false,
}) => (
  <Dropdown
    position={dropdownPosition}
    target={
      <Button
        scale={buttonScale}
        variant="text"
        style={{ display: "flex", alignItems: "center" }}
        startIcon={<LanguageOutlinedIcon width="24px" />}
      >
        {!hideLanguage && (
          <p className="text-sm font-medium text-gray-900 dark:text-white" color={color}>
            {currentLang?.toUpperCase()}
          </p>
        )}
      </Button>
    }
  >
    {langs.map((lang) => (
      <MenuButton
        key={lang.locale}
        fullWidth
        onClick={() => setLang(lang)}
        // Safari fix
        style={{ minHeight: "32px", height: "auto" }}
        className="text-sm font-medium text-gray-900 dark:text-white"
      >
        {lang.language}
      </MenuButton>
    ))}
  </Dropdown>
);

export default React.memo(LangSelector, (prev, next) => prev.currentLang === next.currentLang);
