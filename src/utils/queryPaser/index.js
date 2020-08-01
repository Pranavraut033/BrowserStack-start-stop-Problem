import querystring from "querystring";

export default function (req, _, next) {
  let i = req.url.indexOf("?");
  let a = {};
  if (i != -1) {
    let parameters = querystring.parse(req.url.slice(i + 1));
    for (const key in parameters) a[key] = parameters[key];
  }
  req.queryParams = Object.freeze(a);
  next();
}
