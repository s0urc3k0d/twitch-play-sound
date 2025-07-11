const white = '#fff'
const black = '#0d1117'

export const customColors = {
  // Couleurs Twitch inspirées
  twitch: {
    purple: '#9146FF',
    darkPurple: '#5C16C5',
    lightPurple: '#A970FF',
    green: '#00F5A0',
    darkGreen: '#00D084',
    blue: '#00A8FC',
    darkBlue: '#0085CC',
    orange: '#FF8C00',
    darkOrange: '#E67300'
  },
  // Status colors adaptées
  danger: {
    contrastText: white,
    main: '#FF4757',
    light: '#FF6B7A',
    dark: '#C44569'
  },
  warning: {
    contrastText: white,
    main: '#FFA726',
    light: '#FFB74D',
    dark: '#F57C00'
  },
  success: {
    contrastText: white,
    main: '#00F5A0',
    light: '#4AFFB4',
    dark: '#00D084'
  },
  info: {
    contrastText: white,
    main: '#00A8FC',
    light: '#42A5F5',
    dark: '#0085CC'
  },
  // Gaming/Streaming specific colors
  streaming: {
    live: '#00C853',
    offline: '#747F8D',
    away: '#FFA726',
    dnd: '#FF4757'
  }
}

export default {
  common: {
    white,
    black
  },
  primary: {
    contrastText: white,
    main: '#9146FF', // Twitch purple principal
    light: '#A970FF',
    dark: '#5C16C5'
  },
  secondary: {
    contrastText: black,
    main: '#00F5A0', // Twitch green
    light: '#4AFFB4',
    dark: '#00D084'
  },
  error: {
    contrastText: white,
    main: '#FF4757',
    light: '#FF6B7A',
    dark: '#C44569'
  },
  warning: {
    contrastText: black,
    main: '#FFA726',
    light: '#FFB74D',
    dark: '#F57C00'
  },
  info: {
    contrastText: white,
    main: '#00A8FC',
    light: '#42A5F5',
    dark: '#0085CC'
  },
  success: {
    contrastText: black,
    main: '#00C853',
    light: '#4AFFB4',
    dark: '#00D084'
  },
  text: {
    primary: '#212121',           // Texte principal très foncé pour bon contraste
    secondary: '#424242',         // Texte secondaire gris foncé
    disabled: '#9E9E9E'          // Texte désactivé gris moyen
  },
  background: {
    default: '#FAFAFA',          // Arrière-plan principal très clair
    paper: '#FFFFFF'             // Arrière-plan des cartes blanc
  },
  action: {
    active: '#9146FF',
    hover: 'rgba(145, 70, 255, 0.04)',
    selected: 'rgba(145, 70, 255, 0.08)',
    disabled: 'rgba(33, 33, 33, 0.26)',
    disabledBackground: 'rgba(33, 33, 33, 0.12)'
  },
  divider: 'rgba(33, 33, 33, 0.12)'
}
