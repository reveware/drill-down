import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Type } from '@nestjs/common';
import {CustomError} from '@drill-down/interfaces'
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as _ from 'lodash';

/* https://docs.nestjs.com/pipes */

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata;

        if (!metatype || !this.shouldValidate(metatype)) {
            return value;
        }

        const object = plainToClass(metatype, value);

        const errors = await validate(object);

        if (errors.length > 0) {
            let failedConstraints: string[] = [];

             _.forEach(errors, (error) => {
                const { constraints } = error;
                failedConstraints = _.concat(failedConstraints, _.values(constraints));
            });

            throw new BadRequestException(failedConstraints, 'Validation Failed');
        }
        return value;
    }

    private shouldValidate(metatype: Type<unknown>): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
