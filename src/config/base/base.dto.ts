import { ApiResponseModelProperty } from '@nestjs/swagger'

const example = new Date().toISOString()

export class BaseDTO {
  @ApiResponseModelProperty({ example })
  createdAt?: Date

  @ApiResponseModelProperty({ example })
  updatedAt?: Date
}
