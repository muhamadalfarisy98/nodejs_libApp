import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthValidator from 'App/Validators/AuthValidator'
import User from 'App/Models/User'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
    /**
     * 
     * @swagger
     * /api/v1/register:
     *      post:
     *          summary: RegisterUser
     *          tags:
     *              -   Auth
     *          requestBody:
     *              required:   true    
     *              content:       
     *                  application/json:
     *                      description:    Register payload
     *                      schema:
     *                          type:   object
     *                          properties:
     *                              nama:
     *                                  type:   string
     *                                  example:    riski
     *                                  required:   true    
     *                              email:
     *                                  type:   string
     *                                  example:    riski@gmail.com     
     *                                  required:   true    
     *                              password:
     *                                  type:   string
     *                                  example:    riski1234
     *                                  required:   true
     *          produces:
     *              -   application/json   
     *                   
     *          responses:
     *              200:
     *                  description:    Success
     *              400:    
     *                  description:    Bad Request
     *                  
     */
    // register - user register
    public async register({request,response}: HttpContextContract) {
        try {
            const input = await request.validate(AuthValidator)
            await User.create(input)
            return response.created({
                message : 'berhasil register'
            })

        } catch (error) {
            return response.unprocessableEntity({
                message : error
            })
        }
    }

    /**
     * 
     * @swagger
     * /api/v1/login:
     *      post:
     *          summary: LoginUser
     *          tags:
     *              -   Auth
     *          requestBody:    
     *              required:   true
     *              content:        
     *                  application/json:
     *                      description:    Login payload
     *                      schema:
     *                          type:   object
     *                          properties:
     *                              email:
     *                                  type:   string
     *                                  example:    'faris@gmail.com'
     *                                  required:   true
     *                              password:
     *                                  type:   string
     *                                  example:    'faris12345'
     *                                  required:   true
     *          produces:
     *              -   application/json   
     *                   
     *          responses:
     *              200:
     *                  description:    Success
     *              400:
     *                  description:    Bad request
     *                  
     */
    // login - user login
    public async login({request,response, auth}: HttpContextContract) {
        try {
            const loginVal = schema.create({
                email:schema.string(),
                password:schema.string()
            })
    
            await request.validate({
                schema:loginVal
            })
            const email= request.input('email')
            const password = request.input('password')
    
            const token = await auth.use('api').attempt(email,password,{
                expiresIn : '7 days'
            })
    
            return response.ok({
                message : "login berhasil",
                token : token
            })
        } catch (error) {
            if(error.guard){
                return response.badRequest({
                    message : "login validasi",
                    error : error.message
                })
            }
            return response.badRequest({
                message : "login gagal",
                error : error.message
            })
        }
    }

    /**
     * 
     * @swagger
     * /api/v1/otp-confirmation:
     *      post:
     *          summary: OTPVerify
     *          tags:
     *              -   Auth
     *          requestBody:
     *              required:   true
     *              content:
     *                  application/json:
     *                      description:    Verify email payload
     *                      schema:
     *                          type:   object
     *                          properties:
     *                              email:
     *                                  type:   string
     *                                  example:    riski@gmail.com
     *                                  required:   true
     *          security:
     *          -   bearerAuth: []
     *          produces:
     *              -   application/json   
     *                   
     *          responses:
     *              200:
     *                  description:    Success
     *              400:
     *                  description:    Bad request
     *              401:
     *                  description:    Unauthorized
     *                  
     */
    // otp - verifies email
    public async otp({request,response,auth}: HttpContextContract) {
        try {
            const email = request.input('email')
            const userEmail = auth.user?.email
            if (email == userEmail) {
                return response.ok({
                    message : "email is verified"
                })
            }
            return response.badRequest({
                message : 'email is not verified'
            })

        } catch (error) {
            return response.unprocessableEntity({
                message : error
            })
        }
    }
    
    /**
     * 
     * @swagger
     * /api/v1/user-info:
     *      get:
     *          summary: GetUserInfo
     *          tags:
     *              -   Auth
     *          security:
     *          -   bearerAuth: []
     *          produces:
     *              -   application/json   
     *                   
     *          responses:
     *              200:
     *                  description:    Success
     *              400:
     *                  description:    Bad request
     *              401:
     *                  description:    Unauthorized
     *                  
     */
    // userInfo - checks user info based on token
    public async userInfo({response, auth}: HttpContextContract) {
        const data = auth.user
        return response.ok({
            message : data
        })
    }

    /**
     * 
     * @swagger
     * /api/v1/profile:
     *      post:
     *          summary: EditProfile
     *          tags:
     *              -   Auth
     *          requestBody:
     *              required:   true
     *              content:
     *                  application/json:
     *                      description:    edit profile payload
     *                      schema:
     *                          type:   object
     *                          properties:
     *                              bio:
     *                                  type:   string
     *                                  example:    'maju tak gentar'
     *                                  required:   true
     *                              alamat:
     *                                  type:   string
     *                                  example:    'jl.in dulu aja'
     *                                  required:   true
     *          security:
     *          -   bearerAuth: []
     *          produces:
     *              -   application/json   
     *                   
     *          responses:
     *              200:
     *                  description:    Success
     *              400:
     *                  description:    Bad request
     *              401:
     *                  description:    Unauthorized
     *                  
     */
    // updateprofile - update user profile
    public async updateprofile({response,request, auth}: HttpContextContract) {
        const data = auth.user

        const validasiProfile = schema.create({
            alamat : schema.string(),
            bio : schema.string()
        })

        await request.validate({schema: validasiProfile})
        const alamat = request.input('alamat')
        const bio = request.input('bio')

        const persistancePayload = { 
            alamat,
            bio
        }

        await data?.related('userprofile').updateOrCreate({},persistancePayload)
        
        return response.ok({
            message : "profile berhasil diupdate"
        })
    }

}
