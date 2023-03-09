import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Buku from 'App/Models/Buku'
import BukuValidator from 'App/Validators/BukuValidator'
import Kategori from 'App/Models/Kategori'
import Database from '@ioc:Adonis/Lucid/Database'


export default class BukusController {
    /**
     * 
     * @swagger
     * /api/v1/buku:
     *      get:
     *          summary: GetAllBuku
     *          tags:
     *              -   Buku
     *          security:
     *          -   bearerAuth: []
     *          produces:
     *              -   application/json   
     *                   
     *          responses:
     *              200:
     *                  description:    Success
     *              401:
     *                  description:    Unauthorized
     *                  
     */
    // get - all books
    public async index({response}: HttpContextContract) {
        const books = await Buku.query().preload('category')
        response.status(200).json({
            message : "data berhasil ditampilkan",
            data : books
        })
    }

    /**
     * 
     * @swagger
     * /api/v1/buku/{id}:
     *      get:
     *          summary: GetBukuByID
     *          tags:
     *              -   Buku
     *          parameters:
     *              -   name:   id
     *                  description:    id buku
     *                  in: path
     *                  required:   true
     *                  schema:
     *                      type:   integer
     *                      format: int64
     *                      minimum:    1
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
     // show - get buku by id
    public async show({params,response}: HttpContextContract) {
        const queryID = params.id

        const books = await Buku.query().where('id', queryID)
        if (books.length != 0) {
            return response.ok({
                 message : "data berhasil ditampilkan",
                 data : books
             })
         }

        return response.notFound({
            message : "buku dengan id " + queryID + " tidak ditemukan"
        })
    }

    /**
     * 
     * @swagger
     * /api/v1/buku:
     *      post:
     *          summary: CreateBuku
     *          tags:
     *              -   Buku
     *          requestBody:
     *              required:   true    
     *              content:
     *                  application/json:
     *                      description:    Create buku payload
     *                      schema:
     *                          type:   object
     *                          properties:
     *                              judul:
     *                                  type:   string
     *                                  example:    'sistem kendali'
     *                                  required:   true
     *                              ringkasan:
     *                                  type:   string
     *                                  example:    'kendali analog dan digital'
     *                                  required:   true
     *                              halaman:
     *                                  type:   integer
     *                                  example:    750
     *                                  required:   true
     *                              tahun_terbit:
     *                                  type:   string
     *                                  example:    '2021'
     *                                  required:   true
     *                              kategori_id:
     *                                  type:   integer
     *                                  example:    1
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
    // store - adds new buku
    public async store({request,response}: HttpContextContract) {
        const payload = await request.validate( BukuValidator )

        // validate kategori_id
        const books = await Kategori.query().where('id', payload.kategori_id)
        if (books.length == 0) {
            return response.badRequest({
                 message : "kategori id " + payload.kategori_id + " tidak ditemukan.",
             })
         }

        const newBook = await Buku.create(payload)
        if (newBook){
            return response.created({
                message : "data berhasil ditambahkan"
            })
        }

        return response.badRequest({
            message : "gagal tambah data"
        })
    }

    /**
     * 
     * @swagger
     * /api/v1/buku/{id}:
     *      delete:
     *          summary: DeleteBuku
     *          tags:
     *              -   Buku
     *          parameters:
     *              -   name: id
     *                  description:    id buku
     *                  in: path
     *                  required:   true
     *                  schema:
     *                      type:   integer
     *                      format: int64
     *                      minimum:    1
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
    // destroy - delete buku
    public async destroy({params,response}: HttpContextContract) {
        const queryID = params.id
        const deletedBuku = await Database 
          .from('bukus')
          .where('id', queryID)
          .delete()

        if (deletedBuku){
            return response.ok({
                message : "berhasil hapus data dengan id " + queryID
            })
        }

        return response.badRequest({
            message : "gagal hapus data atau data tidak ditemukan"
        })
    }

    /**
     * 
     * @swagger
     * /api/v1/buku/{id}:
     *      put:
     *          summary: EditBuku
     *          tags:
     *              -   Buku
     *          parameters:
     *              -   name: id
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
     *                      description:    Create buku payload
     *                      schema:
     *                          type:   object
     *                          properties:
     *                              judul:
     *                                  type:   string
     *                                  example:    'sistem kendali'
     *                                  required:   true
     *                              ringkasan:
     *                                  type:   string
     *                                  example:    'kendali analog dan digital'
     *                                  required:   true
     *                              halaman:
     *                                  type:   integer
     *                                  example:    750
     *                                  required:   true
     *                              tahun_terbit:
     *                                  type:   string
     *                                  example:    '2021'
     *                                  required:   true
     *                              kategori_id:
     *                                  type:   integer
     *                                  example:    1
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
    // update - ubah buku
    public async update({request,params,response}: HttpContextContract) {
        const payload = await request.validate( BukuValidator )

        // validate kategori_id
        const books = await Kategori.query().where('id', payload.kategori_id)
        if (books.length == 0) {
            return response.badRequest({
                 message : "kategori id " + payload.kategori_id + " tidak ditemukan.",
             })
         }

        const queryID = params.id
        const updatedBuku= await Database 
          .from('bukus')
          .where('id', queryID)
          .update(payload)
        
        if (updatedBuku){
            return response.ok({
                message : "berhasil ubah data dengan id " + queryID
            })
        }

        return response.badRequest({
            message : "buku dengan id " + queryID + " tidak ditemukan"
        })
    }

}
