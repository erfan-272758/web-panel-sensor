import { HttpError } from "../errors/HttpError.js";

class ErrorController {
  errorCatch(err, req, res, next) {
    if (err instanceof HttpError) {
      if (err.code > 499) console.error("[error-catch]", err);
      return res.status(err.code).json({ message: err.message });
    }

    console.error("[error-catch]", err);
    return res.status(500).json({ message: err?.message });
  }
}

const errorController = new ErrorController();

export default errorController;
