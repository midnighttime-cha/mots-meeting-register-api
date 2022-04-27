import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperService } from 'src/shared/helpers/helper.service';
import { Repository } from 'typeorm';
import { MeetingMembers } from './entities/meeting-member.entity';

@Injectable()
export class MeetingRegisterService extends HelperService {
  constructor(
    @InjectRepository(MeetingMembers)
    private meetingRegisterRepositories: Repository<MeetingMembers>
  ) {
    super()
  }

  async condMeetingRegister(moduleId: number = 0, filters: any = null, pages: any = null) {
    try {
      const conditions = await this.meetingRegisterRepositories.createQueryBuilder("A");

      if (moduleId > 0) {
        await conditions.where("A.id = :moduleId", { moduleId });
      } else {
        await conditions.where("A.is_delete = false");
      }

      if (filters) {
        const { text, firstName, middleName, lastName, email, oraganization, telephoneNo, gender, iamIslamic } = filters;
        const _filterA = { firstName, middleName, lastName, email, oraganization, telephoneNo, gender, iamIslamic };

        for (const key in _filterA) {
          if (typeof _filterA[key] !== "undefined") {
            const _value = _filterA[key];
            await conditions.andWhere(`A.${key}`, _value);
          }
        }

        if (typeof text !== "undefined") {
          await conditions.andWhere(`(
            A.firstName LIKE '%${text}%' OR
            A.middleName LIKE '%${text}%' OR
            A.lastName '%${text}%' OR
            A.email '%${text}%' OR
            A.oraganization '%${text}%'
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
      const getItems = await (await (await this.condMeetingRegister(0, filters, pages)).getMany());
      const items = await getItems.map(element => element.toResponseObject());
      const total = await (await (await this.condMeetingRegister(0, filters)).getCount());

      return { items, total };
    } catch (error) {
      throw new HttpException(`[getManyMeetingMember] => ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  async getOneMeetingMember(moduleId: number = 0, filters: any = null, pages: any = null) {
    try {
      const items = await (await (await this.condMeetingRegister(moduleId, filters, pages)).getOne()).toResponseObject();
      const total = await (await (await this.condMeetingRegister(moduleId, filters)).getCount());

      return { items, total };
    } catch (error) {
      throw new HttpException(`[getManyMeetingMember] => ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }



  // Methode POST
  async create(data) {
    try {
      const created = await this.meetingRegisterRepositories.create(data);
      await this.meetingRegisterRepositories.save(created);
      return await created;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }



  // Method PUT
  // async update(payloadId: number, id: number, data) {
  //   try {
  //     await this.meetingRegisterRepositories.update({ id }, { ...data, modifyBy: payloadId });
  //     const items = await this.meetingRegisterRepositories.findOne(id);
  //     return await items;
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  async isActive(id: number, status: boolean, payloadId: number) {
    try {
      await this.meetingRegisterRepositories.update({ id }, { isActive: status, modifyBy: payloadId });
      return await { accepted: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }




  // Method DELETE
  async delete(id: number, payloadId: number) {
    try {
      await this.meetingRegisterRepositories.update({ id }, { isDelete: true, modifyBy: payloadId });
      return await { deleted: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
