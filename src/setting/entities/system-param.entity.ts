import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "system_params" })
export class SystemParams {
  @PrimaryGeneratedColumn({ name: "id", type: "int4" }) id: number;
  @Column({ name: "name" }) name: string;
  @Column({ name: "value" }) value: string;
  @Column({ name: "description" }) description: string;
  @Column({ name: 'is_active', default: true }) isActive: boolean;
  @Column({ name: 'is_delete', default: false }) isDelete: boolean;
  @Column({ name: 'create_by', default: 1 }) createBy: number;
  @Column({ name: 'modify_by', default: 1 }) modifyBy: number;
  @CreateDateColumn({ name: 'create_at' }) createAt: Date;
  @UpdateDateColumn({ name: 'modify_at' }) modifyAt: Date;

  toResponseObject() {
    const { id, name, value, description, isActive, isDelete, createBy, modifyBy, createAt, modifyAt } = this;
    return { id, name, value, description, isActive, isDelete, createBy, modifyBy, createAt, modifyAt };
  }
}