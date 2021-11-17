import express from 'express';
import * as deviceTemplateController from '../../controller/device-template.controller';

const router = express.Router();

//getAll
router.get('/', deviceTemplateController.getAll);
router.post('/', deviceTemplateController.createDeviceTemplate);
router.put('/:deviceTemplateId', deviceTemplateController.updateDeviceTemplate);
router.delete(
  '/:deviceTemplateId',
  deviceTemplateController.deleteDeviceTemplate
);
export default router;
