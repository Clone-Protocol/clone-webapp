import { createTheme } from '@mui/material/styles'

const defaultTheme = createTheme()
const { breakpoints } = defaultTheme

const headingCommon = {
	fontFamily: 'Inter',
	fontWeight: 600,
	fontStretch: 'normal',
	letterSpacing: 'normal',
}
const paragraphCommon = {
	fontFamily: 'Inter',
	fontWeight: 500,
	fontStretch: 'normal',
	letterSpacing: 'normal',
}

export const theme: ReturnType<typeof createTheme> = createTheme({
	...defaultTheme,
	components: {
		MuiButtonBase: {
			styleOverrides: {
				root: {
					textTransform: 'initial',
				},
			},
			defaultProps: {
				disableRipple: true,
			},
		},
		MuiDrawer: {
			styleOverrides: {
				root: {
					background: '#000'
				}
			}
		},
		MuiButton: {
			styleOverrides: {
				sizeMedium: {
					padding: '13px 33px',
				},
				sizeLarge: {
					padding: '23px 50px',
					[breakpoints.down('md')]: {
						padding: '21px 50px',
					},
				},
				root: {
					textTransform: 'initial',
					lineHeight: 1.2,
					background: '#000'
				},
			},
			defaultProps: {
				variant: 'contained',
				disableElevation: true,
				size: 'medium',
			},
		},
		MuiTab: {
			styleOverrides: {
				root: {
					color: '#989898',
					textTransform: 'none'
				}
			},
			defaultProps: {
				disableRipple: true,
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: '20px',
					boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.08)',
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				select: {

				}
			}
		},
		MuiGrid: {
			styleOverrides: {
				root: {
					marginBottom: '0px',
					flexGrow: 1,
					'& .MuiDataGrid-cell:hover': {
						backgroundColor: 'rgba(38, 38, 38, 0.5)'
					},
				},
			},
		},
		MuiDialog: {
			styleOverrides: {
				root: {
					'& .MuiDialog-paper': {
						background: '#10141f',
						boxShadow: '0 8px 20px rgb(0 0 0 / 60%)',
						borderRadius: '10px'
					},
					'& .MuiBackdrop-root': {
						background: 'rgba(13, 13, 13, 0.4)',
						backdropFilter: 'blur(3px)',
					}
				}
			}
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					border: 'none',
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					borderRadius: '12px',
					border: 'none',
				},
				input: {
					border: 'none',
				},
			},
		},
		MuiSnackbar: {
			defaultProps: {
				autoHideDuration: 2500,
			},
		},
	},
	typography: {
		fontFamily: [
			'Inter',
			'"Helvetica Neue"',
			'Arial',
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		h1: {
			...headingCommon,
			fontSize: '36px',
		},
		h2: {
			...headingCommon,
			fontSize: '32px',
		},
		h3: {
			...headingCommon,
			fontSize: '20px',
		},
		h4: {
			...headingCommon,
			fontSize: '16px',
		},
		p_xxlg: {
			...paragraphCommon,
			fontSize: '17.3px',
		},
		p_xlg: {
			...paragraphCommon,
			fontSize: '16px',
		},
		p_lg: {
			...paragraphCommon,
			fontSize: '14px',
		},
		p: {
			...paragraphCommon,
			fontSize: '12px',
		},
		p_sm: {
			...paragraphCommon,
			fontSize: '10px',
		},
		p_xsm: {
			...paragraphCommon,
			fontSize: '8px',
		},
	},
	palette: {
		common: {
			black: '#000000',
			white: '#ffffff',
		},
		primary: {
			light: '#4fe5ff',
			main: '#4fe5ff',
			dark: '#4fe5ff',
		},
		hover: '#37a0b3',
		info: {
			main: '#258ded',
		},
		warning: {
			main: '#ff8d4e',
		},
		error: {
			main: '#ed2525',
		},
		text: {
			primary: '#ffffff',
			secondary: '#989898'
		},
	},
	basis: {
		textRaven: '#8988a3',
		revolver: '#1d142e',
		lightSlateBlue: '#8070ad',
		melrose: '#c4b5fd',
		portGore: '#414166',
		raven: '#73737d',
		ghost: '#9e9e9e',
		lightGreen: '#00ff99',
		fadedYellow: '#fffc72',
		cerisePink: '#ff0084',
		royalPurple: '#14081c',
		darkPurple: '#080018',
		cinder: '#0f0e14',
		raisinBlack: '#1d142e',
		nobleBlack: '#201c27',
		backInBlack: '#16141b',
		plumFuzz: '#332e46',
		liquidityBlue: '#4fe5ff', // temp for liquidity
		gloomyBlue: '#24abc2',
		jurassicGrey: '#1a1c28',
		skylight: '#b5fdf9',
		slug: '#66707e',
		shadowGloom: '#414e66',
		royalNavy: '#071031',
		darkNavy: '#000e22',
	},
	boxes: {
		darkBlack: '#1b1b1b',
		black: '#242424',
		lightBlack: '#2d2d2d',
		blackShade: '#363636',
		greyShade: '#3f3f3f',
		grey: '#767676'
	},
	gradients: {
		light: 'linear-gradient(to right, #ed25c1 0%, #a74fff 16%, #f096ff 34%, #fff 50%, #ff96e2 68%, #874fff 83%, #4d25ed, #4d25ed)',
		darker: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.4), linear-gradient(to right, #ed25c1 0%, #a74fff 16%, #f096ff 34%, #fff 50%, #ff96e2 68%, #874fff 83%, #4d25ed)',
		metallic: 'linear-gradient(81deg, #258ded 0%, #4fe5ff 24%, #96efff 36%, #fff 48%, #96efff 60%, #4fe5ff 72%, #258ded 96%)',
		temperatureL2H: 'linear-gradient(to right, #fff 51%, #ff0084 100%)',
		purpleMetallic: 'linear-gradient(84deg, #8925ed 1%, #7d4fff 25%, #ab96ff 36%, #fff 48%, #ab96ff 60%, #7d4fff 72%, #8925ed 95%)',
		simple: 'linear-gradient(to right, #fff 21%, #4fe5ff 96%)',
		temperatureH2L: 'linear-gradient(to right, #ff8e4f 0%, #fff 100%)',
		healthscore: 'linear-gradient(to right, #ff006b 0%, #4fe5ff 100%)',
		cloneLevel: 'linear-gradient(to right, #b5fdf9 2%, #c4b5fd 93%)',
	}
})

declare module '@mui/material/styles' {
	interface TypographyVariants {
		p_xxlg: React.CSSProperties;
		p_xlg: React.CSSProperties;
		p_lg: React.CSSProperties;
		p: React.CSSProperties;
		p_sm: React.CSSProperties;
		p_xsm: React.CSSProperties;
	}

	// allow configuration using `createTheme`
	interface TypographyVariantsOptions {
		p_xxlg?: React.CSSProperties;
		p_xlg?: React.CSSProperties;
		p_lg?: React.CSSProperties;
		p?: React.CSSProperties;
		p_sm?: React.CSSProperties;
		p_xsm?: React.CSSProperties;
	}

	interface Palette {
		hover: React.CSSProperties['color'];
	}
	interface PaletteOptions {
		hover?: React.CSSProperties['color'];
	}

	interface Theme {
		basis: {
			textRaven?: React.CSSProperties['color'];
			revolver?: React.CSSProperties['color'];
			lightSlateBlue?: React.CSSProperties['color'];
			melrose?: React.CSSProperties['color'];
			portGore?: React.CSSProperties['color'];
			raven?: React.CSSProperties['color'];
			ghost?: React.CSSProperties['color'];
			lightGreen?: React.CSSProperties['color'];
			fadedYellow?: React.CSSProperties['color'];
			cerisePink?: React.CSSProperties['color'];
			royalPurple?: React.CSSProperties['color'];
			darkPurple?: React.CSSProperties['color'];
			cinder?: React.CSSProperties['color'];
			raisinBlack?: React.CSSProperties['color'];
			nobleBlack?: React.CSSProperties['color'];
			backInBlack?: React.CSSProperties['color'];
			plumFuzz?: React.CSSProperties['color'];
			liquidityBlue?: React.CSSProperties['color'];
			gloomyBlue?: React.CSSProperties['color'];
			jurassicGrey: React.CSSProperties['color'];
			skylight: React.CSSProperties['color'];
			slug: React.CSSProperties['color'];
			shadowGloom: React.CSSProperties['color'];
			royalNavy: React.CSSProperties['color'];
			darkNavy: React.CSSProperties['color'];
		};
		boxes: {
			darkBlack: React.CSSProperties['color'];
			black: React.CSSProperties['color'];
			lightBlack: React.CSSProperties['color'];
			blackShade: React.CSSProperties['color'];
			greyShade: React.CSSProperties['color'];
			grey: React.CSSProperties['color'];
		};
		gradients: {
			light: React.CSSProperties['color'];
			darker: React.CSSProperties['color'];
			metallic?: React.CSSProperties['color'];
			temperatureL2H?: React.CSSProperties['color'];
			purpleMetallic?: React.CSSProperties['color'];
			simple?: React.CSSProperties['color'];
			temperatureH2L?: React.CSSProperties['color'];
			healthscore?: React.CSSProperties['color'];
			cloneLevel?: React.CSSProperties['color'];
		}
	}
	interface ThemeOptions {
		basis: {
			textRaven?: React.CSSProperties['color'];
			revolver?: React.CSSProperties['color'];
			lightSlateBlue?: React.CSSProperties['color'];
			melrose?: React.CSSProperties['color'];
			portGore?: React.CSSProperties['color'];
			raven?: React.CSSProperties['color'];
			ghost?: React.CSSProperties['color'];
			lightGreen?: React.CSSProperties['color'];
			fadedYellow?: React.CSSProperties['color'];
			cerisePink?: React.CSSProperties['color'];
			royalPurple?: React.CSSProperties['color'];
			darkPurple?: React.CSSProperties['color'];
			cinder?: React.CSSProperties['color'];
			raisinBlack?: React.CSSProperties['color'];
			nobleBlack?: React.CSSProperties['color'];
			backInBlack?: React.CSSProperties['color'];
			plumFuzz?: React.CSSProperties['color'];
			liquidityBlue?: React.CSSProperties['color'];
			gloomyBlue?: React.CSSProperties['color'];
			jurassicGrey: React.CSSProperties['color'];
			skylight: React.CSSProperties['color'];
			slug: React.CSSProperties['color'];
			shadowGloom: React.CSSProperties['color'];
			royalNavy: React.CSSProperties['color'];
			darkNavy: React.CSSProperties['color'];
		};
		boxes: {
			darkBlack?: React.CSSProperties['color'];
			black?: React.CSSProperties['color'];
			lightBlack?: React.CSSProperties['color'];
			blackShade?: React.CSSProperties['color'];
			greyShade?: React.CSSProperties['color'];
			grey?: React.CSSProperties['color'];
		};
		gradients: {
			light?: React.CSSProperties['color'];
			darker?: React.CSSProperties['color'];
			metallic?: React.CSSProperties['color'];
			temperatureL2H?: React.CSSProperties['color'];
			purpleMetallic?: React.CSSProperties['color'];
			simple?: React.CSSProperties['color'];
			temperatureH2L?: React.CSSProperties['color'];
			healthscore?: React.CSSProperties['color'];
			cloneLevel?: React.CSSProperties['color'];
		}
	}
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
	interface TypographyPropsVariantOverrides {
		p_xxlg: true;
		p_xlg: true;
		p_lg: true;
		p: true;
		p_sm: true;
		p_xsm: true;
	}
}