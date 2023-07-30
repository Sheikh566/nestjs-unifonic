/* eslint-disable prettier/prettier */
import { ConfigurableModuleBuilder } from '@nestjs/common';

import { ExtraConfiguration, UnifonicModuleOptions } from './unifonic.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<UnifonicModuleOptions>()
    .setExtras<ExtraConfiguration>({ isGlobal: false }, (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }))
    .setClassMethodName('forRoot')
    .build();
