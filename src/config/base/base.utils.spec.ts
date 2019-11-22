import { typeNumber } from './base.utils'

describe('Base utils', () => {
  it('should return number instance', () => {
    const response = typeNumber()
    expect(response).toEqual(Number)
  })
})
