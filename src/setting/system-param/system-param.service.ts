import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperService } from 'src/shared/helpers/helper.service';
import { Repository } from 'typeorm';
import { SystemParams } from '../entities/system-param.entity';

@Injectable()
export class SystemParamService extends HelperService {
  constructor(
    @InjectRepository(SystemParams)
    private systemParamRepositories: Repository<SystemParams>
  ) {
    super()
  }

  async condMeetingRegister(name: string = "", filters: any = null, pages: any = null) {
    try {
      const conditions = await this.systemParamRepositories.createQueryBuilder("A");

      if (name !== "") {
        await conditions.where("A.name = :name", { name });
      } else {
        await conditions.where("A.is_delete = false");
      }

      if (filters) {
        const { text, name, value, description } = filters;
        const _filterA = { name, value };

        for (const key in _filterA) {
          if (typeof _filterA[key] !== "undefined") {
            const _value = _filterA[key];
            await conditions.andWhere(`A.${key}`, _value);
          }
        }

        if (typeof text !== "undefined") {
          await conditions.andWhere(`(
            A.name LIKE '%${text}%' OR
            A.description '%${text}%'
          )`);
        }
      }

      if (pages) {
        await conditions
          .skip(pages.start)
          .take(pages.limit);
      }

      if (filters) {
        if (typeof filters.sort !== "undefined") {
          const _sorts = `${filters.sort}`.split('-');
          await conditions.orderBy(`A.${_sorts[0]}`, _sorts[1] === "ASC" ? "ASC" : "DESC");
        }
      }

      return await conditions;
    } catch (error) {
      throw new HttpException(`[condMeetingRegister] => ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  async getManyMeetingMember(filters: any = null, pages: any = null) {
    try {
      const getItems = await (await (await this.condMeetingRegister("", filters, pages)).getMany());
      const items = await getItems.map(element => element.toResponseObject());
      const total = await (await (await this.condMeetingRegister("", filters)).getCount());

      return { items, total };
    } catch (error) {
      throw new HttpException(`[getManyMeetingMember] => ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  async getOneMeetingMember(name: string = "", filters: any = null, pages: any = null) {
    try {
      const items = await (await (await this.condMeetingRegister(name, filters, pages)).getOne()).toResponseObject();
      const total = await (await (await this.condMeetingRegister(name, filters)).getCount());

      return { items, total };
    } catch (error) {
      throw new HttpException(`[getManyMeetingMember] => ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }



  // Methode POST
  async create(data) {
    try {
      const created = await this.systemParamRepositories.create(data);
      await this.systemParamRepositories.save(created);
      return await created;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }



  // Method PUT
  // async update(payloadId: number, id: number, data) {
  //   try {
  //     await this.systemParamRepositories.update({ id }, { ...data, modifyBy: payloadId });
  //     const items = await this.systemParamRepositories.findOne(id);
  //     return await items;
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  async isActive(id: number, status: boolean, payloadId: number) {
    try {
      await this.systemParamRepositories.update({ id }, { isActive: status, modifyBy: payloadId });
      return await { accepted: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }




  // Method DELETE
  async delete(id: number, payloadId: number) {
    try {
      await this.systemParamRepositories.update({ id }, { isDelete: true, modifyBy: payloadId });
      return await { deleted: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
