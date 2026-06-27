const sanitizeInput = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  for (const key in obj) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else {
      obj[key] = sanitizeInput(obj[key]);
    }
  }
  return obj;
};

const sanitizeRequest = (req, res, next) => {
  if (req.body) req.body = sanitizeInput(req.body);
  if (req.params) req.params = sanitizeInput(req.params);
  next();
};

module.exports = sanitizeRequest;