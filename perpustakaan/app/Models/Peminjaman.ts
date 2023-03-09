import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Buku from './Buku'
import User from './User'

export default class Peminjaman extends BaseModel {
  public static table = 'peminjaman'
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public buku_id: number

  @column()
  public tanggal_pinjam: DateTime

  @column()
  public tanggal_kembali: DateTime

  // m2o - book
  @belongsTo(() => Buku,{
    foreignKey : "buku_id"
  })
  public bukuPinjam: BelongsTo<typeof Buku>

  // m2o - user
  @belongsTo(() => User,{
    foreignKey : "user_id"
  })
  public userPinjam: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
