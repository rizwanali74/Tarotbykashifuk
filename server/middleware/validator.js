export const sanitizeInput = (req, res, next) => {
  const sanitizeValue = (val) => {
    if (typeof val === 'string') {
      // Remove any executable script tags or dangerous javascript protocols
      return val
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .trim();
    }
    if (typeof val === 'object' && val !== null) {
      for (const key in val) {
        if (Object.prototype.hasOwnProperty.call(val, key)) {
          // Prevent MongoDB operator injection like $gt, $ne, $where
          if (key.startsWith('$')) {
            delete val[key];
          } else {
            val[key] = sanitizeValue(val[key]);
          }
        }
      }
    }
    return val;
  };

  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);

  next();
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
};
