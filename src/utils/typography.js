import Typography from "typography";
import theme from "typography-theme-doelger";

const ensureFontDisplay = ({ googleFonts = [] }) => {
  // Nasty hack based on waiting for fix in react-typography:
  // https://github.com/KyleAMathews/typography.js/pull/212/files
  return [
    ...googleFonts.slice(0, -1),
    ...googleFonts.slice(-1).map((font) => {
      return {
        ...font,
        styles: [...(font.styles || []), "&display=swap"],
      };
    }),
  ];
};
const typography = new Typography({
  ...theme,
  googleFonts: ensureFontDisplay(theme),
});

export const { scale, rhythm, options } = typography;
export default typography;
