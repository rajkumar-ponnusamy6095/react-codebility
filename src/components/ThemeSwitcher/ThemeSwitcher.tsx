import { Dropdown } from "react-bootstrap";
import { useTheme } from "../../context/ThemeContext";
import { themes, type ThemeName } from "../../themes/themes";
import "./ThemeSwitcher.css";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const currentTheme = themes[theme];

  return (
    <Dropdown className="theme-switcher">
      <Dropdown.Toggle
        variant="light"
        size="sm"
        id="theme-dropdown"
      >
        <i className="bi bi-palette-fill me-1" aria-hidden="true" />
        {currentTheme.label}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {(Object.keys(themes) as ThemeName[]).map(
          (themeName) => {
            const item = themes[themeName];

            return (
              <Dropdown.Item
                key={themeName}
                active={themeName === theme}
                onClick={() => setTheme(themeName)}
              >
                <span
                  className="theme-color"
                  style={{
                    background: item.primary,
                  }}
                />

                {item.label}
              </Dropdown.Item>
            );
          }
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}