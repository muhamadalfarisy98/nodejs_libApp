import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class User {
  public async handle({auth,response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const user = auth.user?.role == "user";
    if (user){
      await next()
    } else {
      return response.unauthorized({
        message  : "anda tidak punya akses"
      })
    }

  }
}
