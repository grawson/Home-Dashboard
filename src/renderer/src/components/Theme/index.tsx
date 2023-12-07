import { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';

const theme = {
	palette: {
		primary: '#1e1d29',
		secondary: '#FF8479',
		lightgrey: '#686868',
		highlight: '#fff7db',
		separator: '#E9E9E9',
	},
};

const Theme = ({ children }: { children: ReactNode }) => {
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;
