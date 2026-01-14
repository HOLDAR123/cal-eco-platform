import Api from '../api';
import { ResponseType } from '../auth/dto/auth.dto';
import { UserDto, UpdateUserDto } from './dto/user.dto';

class UserMethods extends Api {
  async getMe() {
    return await this.get<ResponseType<UserDto>>('/v1/users/me');
  }

  async updateMe(data: UpdateUserDto) {
    return await this.patch<ResponseType<UserDto>>('/v1/users/me', data);
  }
}

export default new UserMethods();
