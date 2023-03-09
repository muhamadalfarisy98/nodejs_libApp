import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Kategori from './Kategori'

export default class Buku extends BaseModel {
  protected tableName = 'bukus'

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column()
  public judul: string

  @column()
  public ringkasan: string

  @column()
  public tahun_terbit: string

  @column()
  public halaman: number

  @column()
  public kategori_id: number

  // m2o
  @belongsTo(() => Kategori,{
    foreignKey : "kategori_id"
  })
  public category: BelongsTo<typeof Kategori>

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
