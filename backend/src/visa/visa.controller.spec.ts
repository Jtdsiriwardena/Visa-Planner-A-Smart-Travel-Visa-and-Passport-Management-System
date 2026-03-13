import { Test, TestingModule } from '@nestjs/testing';
import { VisaController } from './visa.controller';

describe('VisaController', () => {
  let controller: VisaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisaController],
    }).compile();

    controller = module.get<VisaController>(VisaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
