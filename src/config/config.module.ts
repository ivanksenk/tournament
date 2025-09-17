import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule, ConfigService } from "@nestjs/config";

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.NODE_ENV === 'development' ? '.env.development' : '.env'
        })
    ],
    providers: [ConfigService],
    exports: [ConfigService]
})
export class ConfigModule { }