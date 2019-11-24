import { ApiResponseModelProperty } from '@nestjs/swagger'
import {} from 'twisted-common'

export class MapsDTO extends BaseDTO {
  @ApiResponseModelProperty()
  mapId!: string

  @ApiResponseModelProperty()
  mapName!: string

  @ApiResponseModelProperty()
  notes?: string | null
}
