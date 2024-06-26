import User from '../models/user.model.js';
import { signUpValidator, signInValidator } from '../validators/auth.validator.js';
import {formatZodError} from '../utils/errorMessage.js'
import cryptoHash from 'crypto';

function hashValue(value) {
    const hash = cryptoHash.createHash('sha256');
    hash.update(value);
    return hash.digest('hex')
}

function comparePasswords(inputPassword, hashedPassword) {
    return hashValue(inputPassword)===hashedPassword
};


export const signUp = async (req, res, next) => {
    const registerResults = signUpValidator.safeParse(req.body)
    if(!registerResults) {
        return res.status(400).json(formatZodError
            (registerResults.error.issues))
    }
    try {
        const {userName, phoneNumber, email} = req.body
        const user = await User.findOne({$or:[{userName}, {email}, {phoneNumber}]})
        if (user) {
            res.status(409).json({message: 'user already exist`s'})
        } else{
            const {
                name,
                userName,
                password,
                confirmPassword,
                email,
                phoneNumber,
                bio,
                gender
            } = req.body

             if(password !== confirmPassword) {
                return res.status(403).json({message: 'passwordmand confirmPassword do not match'});
            }
            const encrytion = hashValue (password, confirmPassword);
             const newUser = new User({
                name,
                userName,
                password: encrytion,
                confirmPassword: encrytion,
                email,
                phoneNumber,
                bio,
                gender
            })

        
            await newUser.save()
            res.status(200).json({message:'User registered succesfully', newUser})
            console.log('User registered succesfully', newUser);
        }
    }
 catch (error) {
    res.status(500).json({message: error.message})
    console.log(error.message);}
}

export const signIn = async ( req, res, next) => {

}

export const getSingleUsers = async() =>{}

export const logout = async ( req, res ,next) => {

}