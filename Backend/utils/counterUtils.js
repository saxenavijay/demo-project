const User = require("../models/user.model");
const Counter = require("../models/counter.model");


const giveCounter = async function giveCounter(data) {

    const user = await User.findOne({ _id: data.userId});

    if(user){
            const newCounter = await Counter.create(data);

            if(newCounter){

                user.counter = user.counter + data.counter;
                await user.save();

                return {
                    status:true,
                    message:"give counter success"
                }
            }else{
                return {
                    status:false,
                    message:"give counter failed!"
                }
            }
        
    }else{
        return {
            status:false,
            message:"no user found"
        }
    }
}

const transferCounter = async function transferCounter(data) {

    return new Promise(async (resolve,reject)=>{

        console.log("transfer from - "+data.from+", to - "+data.to+", counter - "+data.counter);

    const user = await User.findOne({ _id: data.from});

    if(user){

        if(user.counter < data.counter){
            resolve( {
                status:false,
                message:"not sufficient counter balance"
            });
        }else{

            //increase counter in other user
            const res = await giveCounter({
                userId:data.to,
                type:"transfer",
                transferFrom:data.from,
                counter:data.counter
            });
            
            if(res.status){

                //descrese counter in user
                user.counter = user.counter - data.counter;
                await user.save();

                resolve({
                    status:true,
                    message:"counter transfer success"
                });
            }else{
                resolve( {
                    status:false,
                    message:"counter transfer failed!"
                })
            }

        }

    }else{
        resolve( {
            status:false,
            message:"no user found"
        })
    }
});
}

module.exports = {
    giveCounter,
    transferCounter
};