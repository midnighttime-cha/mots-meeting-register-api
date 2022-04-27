import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "meeting_members" })
export class MeetingMembers {
  @PrimaryGeneratedColumn({ name: 'id', type: "int4" }) id: number;
  @Column({ name: "first_name" }) firstName: string;
  @Column({ name: "middle_name", nullable: true }) middleName: string;
  @Column({ name: "last_name" }) lastName: string;
  @Column({ name: "email" }) email: string;
  @Column({ name: "organization" }) organization: string;
  @Column({ name: "telephone_no", nullable: true }) telephoneNo: string;
  @Column({ name: "gender", type: "char", default: "M", enum: ["M", "F"] }) gender: string;
  @Column({ name: "iam_islamic", default: false }) iamIslamic: boolean;
  @Column({ name: 'is_active', default: true }) isActive: boolean;
  @Column({ name: 'is_delete', default: false }) isDelete: boolean;
  @Column({ name: 'create_by', default: 1 }) createBy: number;
  @Column({ name: 'modify_by', default: 1 }) modifyBy: number;
  @CreateDateColumn({ name: 'create_at' }) createAt: Date;
  @UpdateDateColumn({ name: 'modify_at' }) modifyAt: Date;

  toResponseObject() {
    const { id, firstName, middleName, lastName, email, organization, telephoneNo, gender, iamIslamic, isActive, isDelete, createBy, modifyBy, createAt, modifyAt } = this;
    return { id, firstName, middleName, lastName, email, organization, telephoneNo, gender, iamIslamic, isActive, isDelete, createBy, modifyBy, createAt, modifyAt };
  }
}