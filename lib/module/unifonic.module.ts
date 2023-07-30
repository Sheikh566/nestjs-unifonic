import { Module } from '@nestjs/common';

import { UnifonicService } from './unifonic.service';
import { ConfigurableModuleClass } from '../utils';

@Module({
  providers: [UnifonicService],
  exports: [UnifonicService],
})
export class UnifonicModule extends ConfigurableModuleClass {}
