const LogServices = {
  success(...messages) {
    console.info('\x1b[32m', ...messages, '\x1b[0m');
  },
  warn(...messages) {
    console.info('\x1b[33m', ...messages, '\x1b[0m');
  },
};

export default LogServices;
