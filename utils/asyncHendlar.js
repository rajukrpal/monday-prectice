const asyncHendlar = (reqHandlar)=>{
    (req,res,next)=>{
        Promise.resolve(reqHandlar(req,res,next)).catch((err) => next(err) )
    }
}

module.exports = asyncHendlar ;












/*
const asyncHendlar = (fn)=>async(req,res,next)=>{
    try {
        await fn(req,res,next)
    } catch (err) {
        res.status(err.cod || 500).json({
            success:false,
            messages: err.messages
        })
        console.log("ERROR--->")
    }
}
*/