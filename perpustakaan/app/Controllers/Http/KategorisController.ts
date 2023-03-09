import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Kategori from 'App/Models/Kategori'
import KategoriValidator from 'App/Validators/KategoriValidator'
import Database from '@ioc:Adonis/Lucid/Database'

export default class KategorisController {
    /**
     * 
     * @swagger
     * /api/v1/kategori:
     *      get:
     *          summary: GetAllKategori
     *          security:
     *          -   bearerAuth: []
     *          tags:
     *              -   Kategori
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
    // index - gets all categories
    public async index({response}: HttpContextContract) {
        const categories = await Kategori.query().preload('buku')

        response.status(200).json({
            message : "data berhasil ditampilkan",
            data : categories
        })
    }


    /**
     * 
     * @swagger
     * /api/v1/kategori:
     *      post:
     *          summary: CreateKategori
     *          tags:
     *              -   Kategori
     *          requestBody:
     *              required:   true
     *              content:
     *                  application/json:
     *                      description:    edit kategori payload
     *                      schema:
     *                          type:   object
     *                          properties:
     *                              nama:
     *                                  type:   string
     *                                  example:    'komedi'
     *                                  required:   true
     *          security:
     *          -   bearerAuth: []
     *          produces:
     *              -   application/json   
     *                   
     *          responses:
     *              201:
     *                  description:    Success created
     *              400:
     *                  description:    Bad request
     *              401:
     *                  description:    Unauthorized
     *                  
     */    
    // store - adds new kategori
    public async store({request,response}: HttpContextContract) {
        const payload = await request.validate( KategoriValidator )
        const newCategory = await Kategori.create({
            nama: payload.nama,
            })

        if (newCategory){
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
     * /api/v1/kategori/{id}:
     *      get:
     *          summary: GetKategoriByID
     *          tags:
     *              -   Kategori
     *          parameters:
     *              -   name: id
     *                  description:    id kategori
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
     *              401:
     *                  description:    Unauthorized
     *                  
     */
    // show - get kategori by id
    public async show({params,response}: HttpContextContract) {
        const queryID = params.id

        const categories = await Kategori.query().where('id', queryID)
        if (categories.length != 0) {
            return response.ok({
                 message : "data berhasil ditampilkan",
                 data : categories
             })
         }

        return response.notFound({
            message : "kategori dengan id " + queryID + " tidak ditemukan"
        })
    }

    /**
     * 
     * @swagger
     * /api/v1/kategori/{id}:
     *      delete:
     *          summary: DeleteKategori
     *          tags:
     *              -   Kategori
     *          parameters:
     *              -   name: id
     *                  description:    id kategori
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
    // destroy - delete kategori
    public async destroy({params,response}: HttpContextContract) {
        const queryID = params.id
        const deletedCategory = await Database 
          .from('kategoris')
          .where('id', queryID)
          .delete()

        if (deletedCategory){
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
     * /api/v1/kategori/{id}:
     *      put:
     *          summary: EditKategori
     *          tags:
     *              -   Kategori
     *          parameters:
     *              -   name: id
     *                  description:    id pinjaman
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
     *                              nama:
     *                                  type:   string
     *                                  example:    'sample kategori'
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
     *                  
     */
    // update - ubah kategori
    public async update({request,params,response}: HttpContextContract) {
        const payload = await request.validate( KategoriValidator )

        const queryID = params.id
        const updatedCategory = await Database 
          .from('kategoris')
          .where('id', queryID)
          .update(payload)
        
        if (updatedCategory){
            return response.ok({
                message : "berhasil ubah data dengan id " + queryID
            })
        }

        return response.badRequest({
            message : "kategori dengan id " + queryID + " tidak ditemukan."
        })
    }


}
