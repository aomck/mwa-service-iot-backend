import { deviceTemplateService } from '../services';

export const getAll = async (req, res) => {
  try {
    const { query } = req;
    const respData = await deviceTemplateService.list({ query });
    res.json(respData);
  } catch (error) {
    s;
    res
      .status(500)
      .json({ statusCode: '500', message: 'Internal Server Error' });
  }
};

export const createDeviceTemplate = async (req, res) => {
  const { body } = req;
  try {
    const respData = await deviceTemplateService.create({ body });
    res.status(201).json({
      success: true,
      message: 'device template has been created successfully',
    });
  } catch (error) {
    s;
    res
      .status(500)
      .json({ statusCode: '500', message: 'Internal Server Error' });
  }
};

export const updateDeviceTemplate = async (req, res) => {
  const {
    body,
    params: { deviceTemplateId },
  } = req;
  try {
    const respData = await deviceTemplateService.update({
      body,
      deviceTemplateId,
    });
    res.json(respData);
  } catch (error) {
    s;
    res
      .status(500)
      .json({ statusCode: '500', message: 'Internal Server Error' });
  }
};

export const deleteDeviceTemplate = async (req, res) => {
  const {
    params: { deviceTemplateId },
  } = req;
  try {
    const respData = await deviceTemplateService.deleted({
      deviceTemplateId,
    });
    res.json(respData);
  } catch (error) {
    s;
    res
      .status(500)
      .json({ statusCode: '500', message: 'Internal Server Error' });
  }
};
