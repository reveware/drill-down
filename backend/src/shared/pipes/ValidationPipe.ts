import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as _ from 'lodash';

/* https://docs.nestjs.com/pipes */

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value, metadata: ArgumentMetadata) {
        const { metatype } = metadata;

        if (!metatype || !this.shouldValidate(metatype)) {
            return value;
        }

        const object = plainToClass(metatype, value);

        const errors = await validate(object);

        if (errors.length > 0) {
            let failedConstraints = [];

             _.forEach(errors, (error) => {
                const { constraints } = error;
                failedConstraints = _.concat(failedConstraints, _.values(constraints));
            });

            throw new BadRequestException(failedConstraints, 'Validation Failed');
        }
        return value;
    }

    private shouldValidate(metatype): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
