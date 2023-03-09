import { DateTime } from 'luxon'
import { BaseModel, column , hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm'
import Buku from './Buku'
export default class Kategori extends BaseModel {
  protected tableName = 'kategoris'

  @column({ isPrimary: true })
  public id: number

  @column()
  public nama: string

  // o2m - buku
  @hasMany(() => Buku, {
    foreignKey: 'kategori_id', // defaults to userId
  })
  public buku: HasMany<typeof Buku>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
