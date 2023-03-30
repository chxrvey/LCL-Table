import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class TableAvailability {
  @PrimaryColumn()
  TableID!: number;

  @Column({ enum: ['Silver', 'Gold', 'Platinum'] })
  Status!: 'Silver' | 'Gold' | 'Platinum';

  @Column()
  Availability!: boolean;
}
