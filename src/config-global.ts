import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  title: string;
  description: string;
};

// API
// ----------------------------------------------------------------------

export const HOST_API = 'http://localhost:3041';

export const ENDPOINTS = {
  stats: {
    track: '/api/stats/track',
    get: '/api/stats/get',
  },
  rsvp: {
    create: '/api/rsvp/create',
    list: '/api/rsvp/list',
    update: '/api/rsvp/update',
    delete: '/api/rsvp/delete',
  },
  wishes: {
    create: '/api/wishes/create',
    list: '/api/wishes/list',
    update: '/api/wishes/update',
    delete: '/api/wishes/delete',
    like: '/api/wishes/like',
    share: '/api/wishes/share',
  },
  email: {
    sendRsvpNotification: '/api/email/rsvp-notification',
    sendRsvpConfirmation: '/api/email/rsvp-confirmation',
    sendRsvpRejection: '/api/email/rsvp-rejection',
  },
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
  },
};

// DEFAULT LOCALE
// ----------------------------------------------------------------------

export const defaultLocale = 'vi';

// SETTINGS
// ----------------------------------------------------------------------

export const defaultSettings = {
  // light | dark
  themeMode: 'light',
  // ltr | rtl
  themeDirection: 'ltr',
  //  default | blueOrange | greenOrange | purpleTeal | cyanYellow | pinkCyan
  themeColorPresets: 'default',
};

export const CONFIG: ConfigValue = {
  appName: 'Lê Bùi Thanh Vũ',
  appVersion: packageJson.version,
  title: 'Lê Bùi Thanh Vũ - Portfolio',
  description: 'Portfolio của Lê Bùi Thanh Vũ - Full Stack Developer',
} as const;

export const SMTP_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'vuhanwedding@gmail.com',
    pass: 'tlnn svbz nujx aute'
  }
};
