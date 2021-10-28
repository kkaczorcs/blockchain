import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private readonly schema: Joi.Schema) {}

  public async transform(obj: object): Promise<object> {
    const { error, value } = this.schema.validate(obj);

    if (error) {
      throw new BadRequestException({ validationError: error });
    }

    return value;
  }
}
