import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt'
import { RegistrationUserDto } from './dto/registration-user.dto';
import { PostgresErrorCodeEnum } from '../database/postgresErrorCode.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/tokenPayload.interface';
import { MailService } from '../mail/mail.service';
import {VerificationRestoreTokenPayload} from "./interfaces/verification-restore-token-payload.interface";
import {User} from "../users/user.entity";
import {ChangeEmailTokenPayload} from "./interfaces/change-email-token-payload.interface";

@Injectable()
export class AuthService {

  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService,
              private readonly configService: ConfigService, private readonly mailService: MailService) {
  }

  public async getAuthUser(email: string, password: string) {
    try {
      const user = await this.usersService.getByEmail(email)
      const isPasswordMatching = await bcrypt.compare(password, user.password)
      if (!isPasswordMatching) {
        throw new HttpException("Неверный пароль", HttpStatus.BAD_REQUEST)
      }
      return user
    } catch (error) {
      throw new HttpException(error.response, error.status)
    }
  }

  public async registration(registrationData: RegistrationUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(registrationData.password, 10)
      const payload: VerificationRestoreTokenPayload = {email: registrationData.email}
      const newUser = await this.usersService.createUser({
        ...registrationData,
        password: hashedPassword})
      const token: string = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_EMAIL_VERIFICATION_SECRET_KEY'),
        expiresIn: `${this.configService.get('JWT_EMAIL_VERIFICATION_EXPIRATION_TIME')}h`
      })
      await this.mailService.sendUserEmailVerification(newUser.email, token)
      return newUser
    } catch (error) {
      if (error?.code === PostgresErrorCodeEnum.UniqueViolation) {
        throw new HttpException(`Email ${registrationData.email} уже занят, выберите другой`, HttpStatus.CONFLICT)
      }
      throw new HttpException("Что-то пошло не так, попробуйте еще раз", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  //-------------------------------------------------Смена Email--------------------------------------------------------------

  async changeEmail(user: User, newEmail: string) {
    const isNewEmailNotRegister: boolean = await this.usersService.newEmail(newEmail)
    if (isNewEmailNotRegister) {
      const payload: ChangeEmailTokenPayload = {email: newEmail, prevEmail: user.email}
      const token: string = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_CHANGE_EMAIL_SECRET_KEY'),
        expiresIn: `${this.configService.get('JWT_CHANGE_EMAIL_EXPIRATION_TIME')}h`
      })
      await this.mailService.sendEmailChangeLink(newEmail, token)
      return {message: 'Отправлено письмо с подтверждением'}
    }
    throw new HttpException(`Email ${newEmail} уже занят, выберите другой`, HttpStatus.CONFLICT)
  }

  async confirmNewEmail(token: string) {
    const payload: ChangeEmailTokenPayload =
        this.jwtService.verify(token, {secret: this.configService.get('JWT_CHANGE_EMAIL_SECRET_KEY')})
    const user = await this.usersService.getByEmail(payload.prevEmail)
    await this.usersService.changeUserEmail(payload.email, user.id)
    return {message: 'Смена email прошла успешно'}
  }

  //-----------------------------------------------Верификация аккаунта-------------------------------------------------------

  async verificationEmail(token: string) {
    const email: VerificationRestoreTokenPayload =
        this.jwtService.verify(token, {secret: this.configService.get('JWT_EMAIL_VERIFICATION_SECRET_KEY')})
    const user = await this.usersService.getByEmail(email.email)
    if (user.emailVerified) {
      throw new HttpException('Почта уже подтверждена', HttpStatus.BAD_REQUEST)
    }
    await this.usersService.verifyUser(user)
    return {message: 'Аккаунт зарегистрирован'}
  }

  async reCheckEmail(email: string) {
    const user = await this.usersService.getByEmail(email)
    const payload: VerificationRestoreTokenPayload = {email}
    const token: string = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_EMAIL_VERIFICATION_SECRET_KEY'),
      expiresIn: `${this.configService.get('JWT_EMAIL_VERIFICATION_EXPIRATION_TIME')}h`
    })
    try {
      await this.mailService.sendUserEmailVerification(user.email, token)
      return {message: 'Письмо успешно отправлено'}
    } catch (error) {
      console.log(error);
      throw new HttpException('Письмо отправить не удалось, повторите попытку',
          HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  //----------------------------------------------Восстановить пароль---------------------------------------------------------

  async restorePassword(email: string) {
    const user = await this.usersService.getByEmail(email)
    const payload: VerificationRestoreTokenPayload = { email }
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_RESTORE_SECRET_KEY'),
      expiresIn: `${this.configService.get('JWT_RESTORE_EXPIRATION_TIME')}h`
    })
    await this.usersService.restorePasswordTokenSave(user, token)
    await this.mailService.sendRestoreEmailLink(email, token)
  }

  async newPassword(token: string, password: string) {
    const email: VerificationRestoreTokenPayload =
        this.jwtService.verify(token, {secret: this.configService.get('JWT_RESTORE_SECRET_KEY')})
    const user = await this.usersService.getByEmail(email.email)
    if (!user.restorePasswordToken) {
      throw new HttpException('Токен не верный, доступ запрещен', HttpStatus.FORBIDDEN)
    }
    if (user.restorePasswordToken === token) {
      const hashedPassword = await bcrypt.hash(password, 10)
      await this.usersService.newUserPassword(user, hashedPassword)
      return {message: 'Пароль успешно изменен'}
    }
    throw new HttpException('Токен не верный, доступ запрещен', HttpStatus.FORBIDDEN)
  }

  //--------------------------------------Cookie Авторизированного пользователя------------------------------------------------

  public getCookieJwtToken(userId: number) {
    const payload: TokenPayload = { userId }
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_KEY'),
      expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}h`
    })
    const maxAge = this.configService.get('JWT_EXPIRATION_TIME') * 3600

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${maxAge}`
  }

  public getCookieWithJwtRefreshToken(userId: number) {
    const payload: TokenPayload = {userId}
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
      expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRATION_TIME')}h`
    })

    const maxAge = this.configService.get('JWT_REFRESH_EXPIRATION_TIME') * 3600

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${maxAge}`
    return {cookie, token}
  }

  public getCookieForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0'
    ]
  }

}
