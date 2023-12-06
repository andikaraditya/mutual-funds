function errorHandler(error, req, res, next) {
    switch (error.name) {
        case "SequelizeValidationError":
            res.status(400).json({message: error.message})
            break;
        case "BadRequest":
            res.status(400).json({message: error.message})
            break;
        case "Unauthenticated":
            res.status(401).json({message: error.message})
            break;
        case "JsonWebTokenError":
            res.status(401).json({message: error.message})
            break;
        default:
            console.log(error)
            res.status(500).json({message: "Internal server error"})
            break;
    }
}

module.exports = errorHandler