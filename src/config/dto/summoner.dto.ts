import { RegionsList } from '../../enum'
import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsEnum, IsString } from 'class-validator'
import { Regions } from 'twisted/dist/constants'

export class GetSummonerQueryDTO {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  summonerName!: string

  @ApiModelProperty({
    enum: RegionsList,
    type: String
  })
  @IsEnum(RegionsList)
  @IsNotEmpty()
  region!: any

  // Hidden params
  summonerPUUID?: string
}
