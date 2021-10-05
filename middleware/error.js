const errorHandler = (err, req, res, next) => {
    console.log(err.stack.red.underline);
    const error = { ...err };

    error.message = err.message;

    if(error.name === "CastError"){
        error.message = "Дамжуулсан ID буруу бүтэцтэй ID байна.";
        error.statusCode = 400;
    } 
    
    if(error.name === "11000"){
        error.message = "Энэ талбарын утгыг давхардуулж хадгалах боломжгүй";
        error.statusCode = 400;
    }

    if(error.name === "JsonWebTokenError" && error.message === "invalid token"){
        error.message = "Буруу бүтэцтэй token дамжуулсан байна.";
        error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error,
    });
}

module.exports = errorHandler;