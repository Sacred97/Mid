import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {RegistrationUserDto} from './dto/registration-user.dto';
import {AuthService} from './auth.service';
import {LocalGuard} from './guards/local.guard';
import {RequestWithUser} from './interfaces/request-with-user.interface';
import {JwtAuthGuard} from './guards/jwt-auth.guard';
import {JwtRefreshGuard} from './guards/jwt-refresh.guard';
import {UsersService} from '../users/users.service';
import {VerificationGuard} from './guards/verification.guard';
import {VerificationRestoreDto} from "./dto/verification-restore.dto";
import {ChangePasswordDto} from "./dto/change-password.dto";
import {TokenDto} from "./dto/token.dto";
import {ReCheckGuard} from "./guards/re-check.guard";
import {GuestGuard} from "../guest/guest.guard";
import {AdminGuard} from "./guards/admin.guard";

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @UseGuards(GuestGuard)
  @Post('registration')
  async registration(@Body() data: RegistrationUserDto) {
    return await this.authService.registration(data)
  }

  @UseGuards(LocalGuard, VerificationGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    const { user } = request
    const accessTokenCookie = this.authService.getCookieJwtToken(user.id)
    const {cookie: refreshTokenCookie, token: refreshToken} = this.authService.getCookieWithJwtRefreshToken(request.user.id)
    await this.usersService.setCurrentRefreshToken(refreshToken, request.user.id)
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie])
    return await this.usersService.getById(user.id)
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('logout')
  async logout(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id)
    request.res.setHeader('Set-Cookie', this.authService.getCookieForLogOut())
    return;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieJwtToken(request.user.id)
    const {cookie: refreshTokenCookie, token: refreshToken} = this.authService.getCookieWithJwtRefreshToken(request.user.id)
    await this.usersService.setCurrentRefreshToken(refreshToken, request.user.id)
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie])
    return request.user
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin')
  async isAdmin(@Req() req: RequestWithUser) {
    return {status: !!req.user}
  }

  //----------------------------------------------------Проверка почты--------------------------------------------------------------

  @HttpCode(200)
  @Post('verification/verify')
  async emailVerified(@Body() data: TokenDto) {
    return await this.authService.verificationEmail(data.token)
  }

  @UseGuards(ReCheckGuard)
  @HttpCode(200)
  @Post('verification/re-check')
  async emailReCheck(@Body() data: VerificationRestoreDto) {
    return await this.authService.reCheckEmail(data.email)
  }

  //------------------------------------------------------Забыли пароль--------------------------------------------------------

  @UseGuards(GuestGuard)
  @HttpCode(200)
  @Post('password/restore')
  async restorePassword(@Body() data: VerificationRestoreDto) {
    return await this.authService.restorePassword(data.email)
  }

  @UseGuards(GuestGuard)
  @HttpCode(200)
  @Post('password/change')
  async changePassword(@Body() data: ChangePasswordDto) {
    return await this.authService.newPassword(data.token, data.password)
  }

  //------------------------------------------------------Смена email--------------------------------------------------------------

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('email/change')
  async changeEmail(@Req() request: RequestWithUser, @Body() data: VerificationRestoreDto) {
    return await this.authService.changeEmail(request.user, data.email)
  }

  @HttpCode(200)
  @Post('email/confirm')
  async confirmNewEmail(@Body() data: TokenDto) {
    return await this.authService.confirmNewEmail(data.token)
  }

}
