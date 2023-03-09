# nodejs_finalproject

- Author : Muhamad Alfarisy

## Deskripsi
- User dapat melakukan pemesanan peminjaman (create), lalu update, read dan delete peminjaman tersebut.
- Terdapat endpoint khusus petugas CRUD kategori (user ‘petugas’) yang dapat membuat (create), melihat (read) dan mengubah (update) data kategori. 
- Terdapat endpoint khusus petugas CRUD Buku (user ‘petugas’) yang dapat membuat (create), melihat (read) dan mengubah (update) data Buku. 
- Membuat dokumentasi API (swagger)
- Lokal hosting (localhost)
- Implement ORM + query builder
- Implement Auth + middleware

## ERD
![rtf](https://user-images.githubusercontent.com/121075721/221256805-298dfcd6-0de2-4630-90af-b8d561e6f29f.png)

## API Documentation
Postman DOC (complete payload + testcase)
> https://documenter.getpostman.com/view/14230433/2s93CPpX51
![postman](https://user-images.githubusercontent.com/121075721/221329157-485c71b4-9463-40d6-9812-d18f924d4715.png)

swagger
> localhost:3333/swagger/docs/index.html
![swagger](https://user-images.githubusercontent.com/121075721/221329109-e0ed85b0-c9cd-423d-9d6d-bf2e109dea9a.png)

## DB
local -> mysql

## Data Adjustment
note : by default ketika register user (create user) maka role akan diset sebagai `user` 
untuk mengubah role menjadi `petugas`. perlu eksekusi query manual jika di db local
```sql
update users
set role= 'petugas' where id = <user_id>;
```
```sql
-- example data
id|email               |password                                                                |remember_me_token|nama   |role   |created_at         |updated_at         
--+--------------------+------------------------------------------------------------------------+-----------------+-------+-------+-------------------+-------------------
 1|farisykudo@gmail.com|$bcrypt$v=98$r=10$EMFK+APljMtw59tNkaXqyw$5aazzcC/Cs/jddd0ShJiYqW38kEgn38|                 |farisy |petugas|2023-02-24 22:25:28|2023-02-24 22:25:28
 2|riski@gmail.com     |$bcrypt$v=98$r=10$j+CFxFMNhSm6qDFnZEO8FQ$SAc8IOKPhjptFMxH3z69fjOLD0wJI4M|                 |riski  |user   |2023-02-25 00:13:29|2023-02-25 00:13:29
 3|rafa@gmail.com      |$bcrypt$v=98$r=10$Na5XrPheX+g2vF6TvSFwPw$EHF1ilhjd5gRpoanaw4Ficga15Hzm9s|                 |rafasya|user   |2023-02-25 07:53:06|2023-02-25 07:53:06
```


## How to run
0. Create new DB , adjust config in `.env` file
1. go to folder perpustakaan
```cmd
cd perpustakaan
```
2. run binary
```cmd
# option 1
npm run dev

# option 2
node ace serve --watch
```
3. execute migration to db local
```cmd
node ace migration:run
```
4. see existing endpoint
```cmd
node ace list:routes
```
5. hit endpoint, can see it on API documentation or open swagger
> localhost:3333/swagger/docs/index.html
6. need to authorize first (if you are using protected endpoint)
- `user` only can hit `peminjaman,auth` endpoint
- `petugas` only can hit `kategori,buku,auth` endpoint
