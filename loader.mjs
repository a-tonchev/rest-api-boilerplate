// This loader is a workaround if node js removes the --es-module-specifier-resolution=node
// It should be used in the package.json: { "start": "node --experimental-loader ./loader.mjs index.js",}

async function resolve(specifier, context, defaultResolve) {
  let resolvedSpecifier = specifier;

  const shouldNotResolve = ['mjs', 'cjs', 'js', 'json'].some(ext => specifier.endsWith(`.${ext}`));
  // Handle relative paths and subpath imports

  if (
    (specifier.startsWith('.') || specifier.startsWith('lodash-es/')
      || specifier.startsWith('#')) && !shouldNotResolve) {
    resolvedSpecifier = `${specifier}.js`;

    // Check if the file exists
    try {
      return defaultResolve(resolvedSpecifier, context, defaultResolve);
    } catch {
      // If the file with '.js' doesn't exist, fall back to default resolution
    }
  }
  // For other cases, use default resolution
  return defaultResolve(specifier, context, defaultResolve);
}

// eslint-disable-next-line import/prefer-default-export
export { resolve };
