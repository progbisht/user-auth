const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try{
            await requestHandler(req, res, next)
            
        }
        catch(err){
            console.log(err);
            res.status(err.statusCode).json({
                success: false,
                message: err.message
            })
        }
    }
}

export default asyncHandler













// const asyncHandler = (requestHandler) => {
//     (err, req, res, next) => {
//         Promise
//         .resolve(requestHandler(err, req, res, next))
//         .catch((err) => {
//             next(err)
//         })
//     }
// }