/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(()=> {
  // Auth
  Route.post('/register','AuthController.register').as('RegisterUser')
  Route.post('/login','AuthController.login').as('UserLogin')
  Route.post('/otp-confirmation','AuthController.otp').middleware('auth').as('VerifyEmail')
  Route.post('/profile','AuthController.updateprofile').middleware('auth').as('UpdateProfile')

  // User
  Route.get('/user-info','AuthController.userInfo').middleware('auth').as('GetUserInformation')

  // Kategori
  Route.get('/kategori','KategorisController.index').middleware(['auth','isPetugas']).as('GetAllKategori')
  Route.get('/kategori/:id','KategorisController.show').middleware(['auth','isPetugas']).as('GetKategoriByID')
  Route.post('/kategori','KategorisController.store').middleware(['auth','isPetugas']).as('CreateKategori')
  Route.delete('/kategori/:id','KategorisController.destroy').middleware(['auth','isPetugas']).as('DeleteKategori')
  Route.put('/kategori/:id','KategorisController.update').middleware(['auth','isPetugas']).as('UbahKategori')

  // Buku
  Route.get('/buku','BukusController.index').middleware(['auth','isPetugas']).as('GetAllBuku')
  Route.get('/buku/:id','BukusController.show').middleware(['auth','isPetugas']).as('GetBukuByID')
  Route.post('/buku','BukusController.store').middleware(['auth','isPetugas']).as('CreateBuku')
  Route.delete('/buku/:id','BukusController.destroy').middleware(['auth','isPetugas']).as('DeleteBuku')
  Route.put('/buku/:id','BukusController.update').middleware(['auth','isPetugas']).as('UbahBuku')

  // Peminjaman
  Route.get('/peminjaman','PinjamanController.index').middleware(['auth','isUser']).as('GetAllPinjaman')
  Route.get('/peminjaman/:id','PinjamanController.show').middleware(['auth','isUser']).as('GetPinjamanByID')
  Route.post('/buku/:id/peminjaman','PinjamanController.store').middleware(['auth','isUser']).as('AddPeminjaman')

}).prefix('api/v1')