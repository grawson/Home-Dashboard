// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
	export interface DefaultTheme {
		palette: {
			primary: string;
			secondary: string;
			lightgrey: string;
			highlight: string;
			separator: string;
		};
	}
}
