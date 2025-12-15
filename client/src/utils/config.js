// Runtime configuration utility
// Reads from window.__REACT_APP_CONFIG__ (injected at runtime) or falls back to process.env (build-time)

const getConfig = () => {
  // Check if runtime config is available (injected by entrypoint script)
  if (typeof window !== 'undefined' && window.__REACT_APP_CONFIG__) {
    return {
      protocol: window.__REACT_APP_CONFIG__.SERVER_PROTOCOL || 'http',
      ip: window.__REACT_APP_CONFIG__.SERVER_IP || '127.0.0.1',
      port: window.__REACT_APP_CONFIG__.SERVER_PORT || '8443'
    };
  }
  
  // Fallback to build-time environment variables
  return {
    protocol: process.env.REACT_APP_SERVER_PROTOCOL || 'http',
    ip: process.env.REACT_APP_SERVER_IP || '127.0.0.1',
    port: process.env.REACT_APP_SERVER_PORT || '8443'
  };
};

// Override process.env at runtime if config is available
if (typeof window !== 'undefined' && window.__REACT_APP_CONFIG__) {
  // Create a proxy to override process.env values
  const config = getConfig();
  if (!process.env.REACT_APP_SERVER_PROTOCOL) {
    process.env.REACT_APP_SERVER_PROTOCOL = config.protocol;
  }
  if (!process.env.REACT_APP_SERVER_IP) {
    process.env.REACT_APP_SERVER_IP = config.ip;
  }
  if (!process.env.REACT_APP_SERVER_PORT) {
    process.env.REACT_APP_SERVER_PORT = config.port;
  }
}

export const getServerUrl = () => {
  const config = getConfig();
  return `${config.protocol}://${config.ip}:${config.port}`;
};

export const getServerProtocol = () => {
  return getConfig().protocol;
};

export const getServerIP = () => {
  return getConfig().ip;
};

export const getServerPort = () => {
  return getConfig().port;
};

// For backward compatibility
export const REACT_APP_SERVER_PROTOCOL = () => getServerProtocol();
export const REACT_APP_SERVER_IP = () => getServerIP();
export const REACT_APP_SERVER_PORT = () => getServerPort();

