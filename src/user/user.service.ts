import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async createUser(email: string, nickname: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email, deleted: false },
    });
    if (user) {
      throw new UnauthorizedException('이미 존재하는 사용자 입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await this.usersRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });

    return { message: '회원가입이 완료되었습니다.' };
  }

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'nickname'], // 이렇게 하는 이유는 평소에 정보 불러올때 비밀번호 안넘어오게 하려고 entity설정에 select false옵션을 넣어 줬기 때문에
    }); // select 설정을 줘야 비밀번호 가져와진다.
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 유저 입니다.');
    }
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const { id, ...other } = user;
      return { id: id };
    }
    throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
  }
}
