import { createTheme, ThemeOptions } from '@mui/material/styles';

const fontFace = `
    @font-face {
        font-family: 'Be Vietnam Light';
        src: url('/fonts/BeVietnamPro-Light.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Be Vietnam';
        src: url('/fonts/BeVietnamPro-Regular.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Be Vietnam Bold';
        src: url('/fonts/BeVietnamPro-SemiBold.ttf') format('truetype');
    }
`;

const theme: ThemeOptions = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        h1: {
            fontFamily: 'Be Vietnam Bold',
            fontSize: 64,
        },
        h2: {
            fontFamily: 'Be Vietnam Bold',
            fontSize: 40,
        },
        h3: {
            fontFamily: 'Be Vietnam Bold',
            fontSize: 32,
        },
        h4: {
            fontFamily: 'Be Vietnam Bold',
            fontSize: 24,
        },
        body1: {
            fontFamily: 'Be Vietnam',
        },
        button: {
            fontFamily: 'Be Vietnam',
            fontSize: 16,
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
            ${fontFace}
            `,
        },
    },
});

export default theme;
