class ApiError extends Error {
    constructor(
        statusCode,
        message = "something whent wrong",
        error = [],
        statck = ""
        ){
            super(message)
            this.statusCode = statusCode
            this.null
            this.message = this.message
            this.success = false
            this.error =error

            if(statck){
                this.stack = statck
            }else{
                Error.captureStackTrace(this,this.constructor)
            }
        }
}

module.exports = ApiError ;