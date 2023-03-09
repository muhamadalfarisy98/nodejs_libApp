import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Peminjaman from 'App/Models/Peminjaman'
import Buku from 'App/Models/Buku'
import { DateTime } from 'luxon'

export default class PinjamanController {
    /**
     * 
     * @swagger
     * /api/v1/buku/{buku_id}/peminjaman:
     *      post:
     *          summary: CreatePinjaman
     *          tags:
     *              -   Pinjaman
     *          parameters:
     *              -   name: buku_id
     *                  description:    id buku
     *                  in: path
     *                  required:   true
     *                  schema:
     *                      type:   integer
     *                      format: int64
     *                      minimum:    1
     *          requestBody:
     *              required:   true
     *              content:
     *                  application/json:
     *                      description:    edit kategori payload
     *                      schema:
     *                          type:   object
     *                          properties:
     *                              tanggal_pinjam:
     *                                  type:   string
     *                                  example:    '2023-02-25'
     *                                  required:   true
     *                              tanggal_kembali:
     *                                  type:   string
     *                                  example:    '2023-03-25'
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
    // store - add peminjaman
    public async store({request,response, auth, params}: HttpContextContract) {
        const userData = auth.user?.id
        const validasiComment= schema.create({
            tanggal_kembali : schema.date(),
            tanggal_pinjam : schema.date()
        })

        // validasi cek buku
        const books = await Buku.query().where('id', params.id)
        if (books.length == 0) {
            return response.badRequest({
                message : "buku id " + params.id + " tidak ditemukan.",
             })
        }

        //update or delete
        await request.validate({schema: validasiComment})
        await Peminjaman.create({
            user_id : userData, 
            buku_id : params.id,
            tanggal_kembali :request.input('tanggal_kembali'),
            tanggal_pinjam :request.input('tanggal_pinjam')
        })

        return response.ok({
            message : "success add peminjaman"
        })
    }
    /**
     * 
     * @swagger
     * /api/v1/peminjaman:
     *      get:
     *          summary: GetAllPinjaman
     *          tags:
     *              -   Pinjaman
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
     *                  
     */
    // index - get all peminjaman
    public async index({response}: HttpContextContract) {
        const pinjaman = await Peminjaman.query().preload('userPinjam').preload('bukuPinjam')
        response.status(200).json({
            message : "data berhasil ditampilkan",
            data : pinjaman
        })
    }

    /**
     * 
     * @swagger
     * /api/v1/peminjaman/{id}:
     *      get:
     *          summary: GetPinjamanByID
     *          tags:
     *              -   Pinjaman
     *          security:
     *          -   bearerAuth: []
     *          parameters:
     *              -   name: id
     *                  description:    id pinjaman
     *                  in: path
     *                  required:   true
     *                  schema:
     *                      type:   integer
     *                      format: int64
     *                      minimum:    1
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
     // show - get pinjaman by id
     public async show({params,response}: HttpContextContract) {
        const queryID = params.id

        const books = await Peminjaman.query().where('id', queryID)
        if (books.length != 0) {
            return response.ok({
                 message : "data berhasil ditampilkan",
                 data : books
             })
         }

        return response.notFound({
            message : "peminjaman dengan id " + queryID + " tidak ditemukan"
        })
    }
}
