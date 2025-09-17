import { DocumentBuilder} from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
    .setTitle('Tournament Api')
    .setDescription('Test Work Kosenko I.V.')
    .setVersion('1.0')
    .build();
